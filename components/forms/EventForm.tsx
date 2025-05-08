'use client';

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { eventSchema } from "@/lib/validation";
import z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/actions";

const EventForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [eventDetails, setEventDetails] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                eventType: formData.get("eventType") as string,
                imageUrl: formData.get("imageUrl") as string,
                eventDetails,
            };

            await eventSchema.parseAsync(formValues);

            const result = await createEvent(prevState, formData, eventDetails);

            if (result.status === "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Your event has been created successfully!",
                });
                router.push(`/event/${result._id}`);
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors(fieldErrors as unknown as Record<string, string>);
                toast({
                    title: "Error",
                    description: "Please check your input and try again.",
                    variant: "destructive"
                });
                return { ...prevState, error: "Validation failed", status: "ERROR" };
            }

            toast({
                title: "Error",
                description: "An unexpected error has occurred.",
                variant: "destructive"
            });

            return {
                ...prevState,
                error: "An unexpected error has occurred.",
                status: "ERROR",
            };
        }
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: '', status: "INITIAL" });

    return (
        <form action={(formAction)} className="form">
            <div>
                <label htmlFor="title" className="form_label">Event Title</label>
                <Input id="title" name="title" className="form_input" required placeholder="Enter event title" />
                {errors.title && <p className="form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="form_label">Event Description</label>
                <Textarea id="description" name="description" className="form_textarea" required placeholder="Describe the event" />
                {errors.description && <p className="form_error">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="eventType" className="form_label">Event Type</label>
                <Input id="eventType" name="eventType" className="form_input" required placeholder="E.g., Workshop, Seminar, Meetup" />
                {errors.eventType && <p className="form_error">{errors.eventType}</p>}
            </div>

            <div>
                <label htmlFor="imageUrl" className="form_label">Event Image URL</label>
                <Input id="imageUrl" name="imageUrl" className="form_input" required placeholder="Enter event image URL" />
                {errors.imageUrl && <p className="form_error">{errors.imageUrl}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="eventDetails" className="form_label">Event Details</label>
                <MDEditor
                    value={eventDetails}
                    onChange={(value) => setEventDetails(value as string)}
                    id="eventDetails"
                    preview="edit"
                    height={300}
                    style={{ borderRadius: "20px", overflow: "hidden" }}
                    textareaProps={{
                        placeholder: "Provide additional details about the event",
                    }}
                    previewOptions={{
                        disallowedElements: ["style"]
                    }}
                />
                {errors.eventDetails && <p className="form_error">{errors.eventDetails}</p>}
            </div>

            <Button type="submit" className='form_btn' disabled={isPending}>
                {isPending ? 'Submitting ... ' : 'Submit Your Event'}
                <Send className="size-6 ml-2"/>
            </Button>
        </form>
    );
};

export default EventForm;