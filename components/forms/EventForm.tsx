'use client';

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "@/components/ui/button";
import { Send, Calendar as CalendarIcon } from "lucide-react";
import { eventSchema } from "@/lib/validation";
import z from "zod";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const EventForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [eventDetails, setEventDetails] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const router = useRouter();

    const generateSlug = (title: string, date?: Date) => {
        const slugTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const datePart = date ? format(date, "yyyy-MM-dd") : "unknown-date";
        return `${slugTitle}-${datePart}`;
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSlug(generateSlug(newTitle, startDate));
    };

    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date);
        setSlug(generateSlug(title, date));
        // Auto fill end date if it's empty
        if (!endDate) setEndDate(date);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Show preview
        }
    };

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            if (!imageFile) {
                new Error("No image selected.");
            }

            // Upload the image file first
            const uploadFormData = new FormData();
            uploadFormData.append("file", imageFile);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadData.success) {
                new Error("Image upload failed.");
            }

            const imageUrl = `/uploads/${uploadData.name}`;

            // 2. Prepare form values
            const formValues = {
                title: formData.get("title") as string,
                slug: formData.get("slug") as string,
                start_date: startDate?.toISOString(),
                end_date: endDate?.toISOString(),
                location: formData.get("location") as string,
                image: imageUrl,
                description: eventDetails,
            };

            await eventSchema.parseAsync(formValues);

            const result = await createEvent(prevState, formValues);

            if (result.status === "SUCCESS") {
                toast(
                    "✅ Your event has been created successfully!"
);
                router.push(`/events/${result._id}`);
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors(fieldErrors as unknown as Record<string, string>);
                toast(
                    "❌ Please check your input and try again."
                );
                return { ...prevState, error: "Validation failed", status: "ERROR" };
            }

            toast(
                "❌ An unexpected error has occurred."
            );

            return {
                ...prevState,
                error: "An unexpected error has occurred.",
                status: "ERROR",
            };
        }
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: '', status: "INITIAL" });

    return (
        <form action={formAction} className="form">
            <div>
                <label htmlFor="title" className="form_label">Event Title</label>
                <Input
                    id="title"
                    name="title"
                    className="form_input"
                    required
                    placeholder="Enter event title"
                    value={title}
                    onChange={handleTitleChange}
                />
                {errors.title && <p className="form_error">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="form_label">Start Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={`w-full justify-start text-left font-normal bg-amber-50 form_datepicker ${!startDate ? "text-muted-foreground" : ""}`}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a start date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={handleStartDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.start_date && <p className="form_error">{errors.start_date}</p>}
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="form_label">End Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={`w-full justify-start text-left font-normal bg-amber-50 form_datepicker ${!endDate ? "text-muted-foreground" : ""}`}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick an end date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.end_date && <p className="form_error">{errors.end_date}</p>}
            </div>

            <div>
                <label htmlFor="slug" className="form_label">Event Slug</label>
                <Input
                    id="slug"
                    name="slug"
                    className="form_input"
                    required
                    value={slug}
                    placeholder="Autogenerated event slug"
                    readOnly
                />
                {errors.slug && <p className="form_error">{errors.slug}</p>}
            </div>

            <div>
                <label htmlFor="location" className="form_label">Event Location</label>
                <Input id="location" name="location" className="form_input" required placeholder="Enter event location" />
                {errors.location && <p className="form_error">{errors.location}</p>}
            </div>

            <div>
                <label htmlFor="image" className="form_label">Event Image</label>
                <Input
                    id="image"
                    name="image"
                    className="form_img_input"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                />
                {errors.image && <p className="form_error">{errors.image}</p>}
            </div>


            <div data-color-mode="light">
                <label htmlFor="description" className="form_label">Event Description</label>
                <MDEditor
                    value={eventDetails}
                    onChange={(value) => setEventDetails(value as string)}
                    id="description"
                    preview="edit"
                    height={300}
                    style={{ borderRadius: "20px", overflow: "hidden" }}
                    textareaProps={{ placeholder: "Provide detailed description about the event" }}
                    previewOptions={{ disallowedElements: ["style"] }}
                />
                {errors.description && <p className="form_error">{errors.description}</p>}
            </div>

            <Button type="submit" className='form_btn' disabled={isPending}>
                {isPending ? 'Submitting ... ' : 'Submit Your Event'}
                <Send className="size-6 ml-2" />
            </Button>
        </form>
    );
};

export default EventForm;