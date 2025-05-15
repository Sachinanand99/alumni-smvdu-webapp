'use client'

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CampusVisitForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const router = useRouter();

    const [visitDate, setVisitDate] = useState<Date | undefined>(undefined);

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            // Append selected date to formData
            if (visitDate) {
                formData.set('comingDate', visitDate.toISOString());
            }

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
        <form action={formAction} className="form">
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
                <Textarea id="description" name="description" className="form_textarea" required placeholder="Enter the description and the purpose of visit..." />
                {errors.description && <p className="form_error">{errors.description}</p>}
            </div>

            {/* Date of Visit Field */}
            <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="comingDate" className="form_label">Date of Visit</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !visitDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {visitDate ? format(visitDate, "PPP") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={visitDate}
                            onSelect={setVisitDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.comingDate && <p className="form_error">{errors.comingDate}</p>}
            </div>

            <Button type="submit" className='form_btn mt-6' disabled={isPending}>
                {isPending ? 'Submitting ... ' : 'Submit your Request'}
                <Send className="size-6 ml-2" />
            </Button>
        </form>
    );
};

export default CampusVisitForm;
