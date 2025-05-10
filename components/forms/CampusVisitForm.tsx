'use client'

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea,  } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { GuestHouseFormSchema } from "@/lib/validation";
import z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createCampusVisitRequest } from "@/lib/actions";
import { sendEmail } from "@/lib/email";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {cn} from "@/lib/utils"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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

    // Description
    // when they are coming
    // Do they need any accomodation
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
                <Textarea id="description" name="description" className="form_textarea" required placeholder="Enter the description and the purpose of visit..." />
                {errors.description && <p className="form_error">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="comingDate" className="form_label">Date of Visit</label>
                <Textarea id="comingDate" name="comingDate" className="form_"></Textarea>
            {/*    need to add the PopoverTrigger and Calender to input the date fields   */}
            </div>
            {/*<div className="flex flex-col"><label></label><Popover>*/}
            {/*    <PopoverTrigger asChild>*/}
            {/*        <FormControl>*/}
            {/*            <Button*/}
            {/*                variant={"outline"}*/}
            {/*                className={cn(*/}
            {/*                    "w-[240px] pl-3 text-left font-normal",*/}
            {/*                    !field.value && "text-muted-foreground"*/}
            {/*                )}*/}
            {/*            >*/}
            {/*                {field.value ? (*/}
            {/*                    format(field.value, "PPP")*/}
            {/*                ) : (*/}
            {/*                    <span>Pick a date</span>*/}
            {/*                )}*/}
            {/*                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />*/}
            {/*            </Button>*/}
            {/*        </FormControl>*/}
            {/*    </PopoverTrigger>*/}
            {/*    <PopoverContent className="w-auto p-0" align="start">*/}
            {/*        <Calendar*/}
            {/*            mode="single"*/}
            {/*            selected={field.value}*/}
            {/*            onSelect={field.onChange}*/}
            {/*            disabled={(date) =>*/}
            {/*                date > new Date() || date < new Date("1900-01-01")*/}
            {/*        }*/}
            {/*            initialFocus*/}
            {/*        />*/}
            {/*    </PopoverContent>*/}
            {/*</Popover><FormDescription>*/}
            {/*    Your date of birth is used to calculate your age.*/}
            {/*</FormDescription><FormMessage /></div>*/}


    <Button type="submit" className='form_btn' disabled={isPending}>
                {isPending ? 'Submitting ... ' : 'Submit your Request'}
                <Send className="size-6 ml-2"/>
            </Button>
        </form>
    );
};

export default CampusVisitForm;
