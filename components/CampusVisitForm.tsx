'use client'

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { GuestHouseFormSchema } from "@/lib/validation";
import z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createCampusVisitRequest } from "@/lib/actions";

const CampusVisitForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const router = useRouter();

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                batch: formData.get("batch") as string,
                description: formData.get("description") as string,
            };

            await GuestHouseFormSchema.parseAsync(formValues);

            const result = await createCampusVisitRequest(prevState, formData);

            if (result.status === "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Your request has been created successfully",
                });
                router.push(`/`);
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;

                setErrors(fieldErrors as unknown as Record<string, string>);
                toast({
                    title: "Error",
                    description: "Please check your input and try again ...",
                    variant: "destructive",
                });
                return { ...prevState, error: "validation failed", status: "ERROR" };
            }

            toast({
                title: "Error",
                description: "An Unexpected Error has occurred",
                variant: "destructive",
            });

            return {
                ...prevState,
                error: "An unexpected error has occurred",
                status: "ERROR",
            };
        }
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: '', status: "INITIAL" });

    return (
        <form action={(formAction)} className="campus-visit-form">
            <div>
                <label htmlFor="name" className="form-label">Name</label>
                <Input id="name" name="name" className="form-input" required placeholder="Enter Your Name..." />
                {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="email" className="form-label">Email</label>
                <Input id="email" name="email" className="form-input" type="email" required placeholder="Enter Your Email..." />
                {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="form-label">Contact Phone No.</label>
                <Input id="phone" name="phone" className="form-input" required placeholder="Enter Your Contact Number..." />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>

            <div>
                <label htmlFor="batch" className="form-label">Batch</label>
                <Input id="batch" name="batch" className="form-input" required placeholder="Enter Your Batch..." />
                {errors.batch && <p className="form-error">{errors.batch}</p>}
            </div>

            <div>
                <label htmlFor="description" className="form-label">Description</label>
                <Textarea id="description" name="description" className="form-textarea" required placeholder="Enter a brief description..." />
                {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            <Button type="submit" className='form-btn' disabled={isPending}>
                {isPending ? 'Submitting ... ' : 'Submit your Request'}
                <Send className="size-6 ml-2"/>
            </Button>
        </form>
    );
};

export default CampusVisitForm;
