'use client';

import React, { useEffect, useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "@/components/ui/button";
import { Send, Calendar as CalendarIcon } from "lucide-react";
import { eventSchema } from "@/lib/validation";
import z from "zod";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { updateEvent, getEventById } from "@/lib/actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const UpdateEventForm = ({ eventId }: { eventId: string }) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [eventDetails, setEventDetails] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string>("");

    const router = useRouter();

    const generateSlug = (title: string, date?: Date) => {
        const slugTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const datePart = date ? format(date, "yyyy-MM-dd") : "unknown-date";
        return `${slugTitle}-${datePart}`;
    };

    useEffect(() => {
        const loadEvent = async () => {
            const raw = await getEventById(eventId);

            if (raw) {
                const event = {
                    ...raw,
                    _id: raw._id?.toString(),
                    start_date: new Date(raw.start_date),
                    end_date: new Date(raw.end_date),
                };

                setTitle(event.title);
                setSlug(event.slug);
                setLocation(event.location);
                setStartDate(event.start_date);
                setEndDate(event.end_date);
                setEventDetails(event.description);
                setExistingImage(event.image);
            }
        };

        loadEvent();
    }, [eventId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            let imageUrl = existingImage;

            // Upload new image only if replaced
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", imageFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                const uploadData = await uploadRes.json();
                if (!uploadData.success) {
                    throw new Error("Image upload failed.");
                }

                imageUrl = `/uploads/${uploadData.name}`;
            }

            const updatedValues = {
                title,
                slug: generateSlug(title, startDate),
                start_date: startDate?.toISOString(),
                end_date: endDate?.toISOString(),
                location,
                image: imageUrl,
                description: eventDetails,
            };

            await eventSchema.parseAsync(updatedValues);

            const result = await updateEvent(eventId, updatedValues);

            if (result.status === "SUCCESS") {
                toast("✅ Event Updated");
                router.push(`/events/${eventId}`);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.flatten().fieldErrors as any);
                toast("❌ Validation Error");
                return { status: "ERROR" };
            }

            toast("❌ Unexpected Error");
            return { status: "ERROR" };
        }
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit, { status: "INITIAL" });

    return (
        <form action={formAction} className="form">
            {/* Title */}
            <div>
                <label className="form_label">Event Title</label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="form_input"
                />
                {errors.title && <p className="form_error">{errors.title}</p>}
            </div>

            {/* Dates */}
            <div className="flex flex-col gap-2">
                <label className="form_label">Start Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="form_datepicker">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick start date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                </Popover>
                {errors.start_date && <p className="form_error">{errors.start_date}</p>}
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="form_label">End Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="form_datepicker">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick end date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                </Popover>
                {errors.end_date && <p className="form_error">{errors.end_date}</p>}
            </div>

            {/* Location */}
            <div>
                <label className="form_label">Location</label>
                <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="form_input"
                />
                {errors.location && <p className="form_error">{errors.location}</p>}
            </div>

            {/* Image */}
            <div>
                <label className="form_label">Event Image</label>
                <Input
                    type="file"
                    accept="image/*"
                    className="form_img_input"
                    onChange={handleImageChange}
                />
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="mt-2 rounded-md max-h-48" />
                ) : existingImage ? (
                    <img src={existingImage} alt="Existing" className="mt-2 rounded-md max-h-48" />
                ) : null}
            </div>

            {/* Description */}
            <div data-color-mode="light">
                <label className="form_label">Description</label>
                <MDEditor
                    value={eventDetails}
                    onChange={(val) => setEventDetails(val || "")}
                    preview="edit"
                    height={300}
                />
                {errors.description && <p className="form_error">{errors.description}</p>}
            </div>

            {/* Submit */}
            <Button type="submit" className="form_btn mt-4" disabled={isPending}>
                {isPending ? "Updating..." : "Update Event"}
                <Send className="size-6 ml-2" />
            </Button>
        </form>
    );
};

export default UpdateEventForm;
