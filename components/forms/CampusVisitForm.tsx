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
import { sendEmail } from "@/lib/email";

const CampusVisitForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const router = useRouter();

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const response = await fetch("/api/campus-visit", {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(formData.entries())),
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();
            if (result.status === "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Your request has been created successfully",
                });

                router.push(`/`);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An Unexpected Error has occurred",
                variant: "destructive",
            });
        }
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: '', status: "INITIAL" });

    return (
        <form action={(formAction)} className="form">
            <div>
                <label htmlFor="name" className="form_label">Name</label>
                <Input id="name" name="name" className="form_input" required placeholder="Enter Your Name..." />
                {errors.name && <p className="form_error">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="email" className="form_label">Email</label>
                <Input id="email" name="email" className="form_input" type="email" required placeholder="Enter Your Email..." />
                {errors.email && <p className="form_error">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="form_label">Contact Phone No.</label>
                <Input id="phone" name="phone" className="form_input" required placeholder="Enter Your Contact Number..." />
                {errors.phone && <p className="form_error">{errors.phone}</p>}
            </div>

            <div>
                <label htmlFor="batch" className="form_label">Batch</label>
                <Input id="batch" name="batch" className="form_input" required placeholder="Enter Your Batch..." />
                {errors.batch && <p className="form_error">{errors.batch}</p>}
            </div>

            <div>
                <label htmlFor="description" className="form_label">Description</label>
                <Textarea id="description" name="description" className="form_textarea" required placeholder="Enter a brief description..." />
                {errors.description && <p className="form_error">{errors.description}</p>}
            </div>

            <Button type="submit" className='form_btn' disabled={isPending}>
                {isPending ? 'Submitting ... ' : 'Submit your Request'}
                <Send className="size-6 ml-2"/>
            </Button>
        </form>
    );
};

export default CampusVisitForm;
