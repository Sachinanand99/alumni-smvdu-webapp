'use client';

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { AlumniInformationFormSchema } from "@/lib/validation";
import z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createAlumniInformationRequest } from "@/lib/actions";

const CampusVisitRequestForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const router = useRouter();

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                fullName: formData.get("fullName") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                entryNumber: formData.get("entryNumber") as string,
                department: formData.get("department") as string,
                degree: formData.get("degree") as string,
                professionalSector: formData.get("professionalSector") as string,
                countryOfResidence: formData.get("countryOfResidence") as string,
                postalAddress: formData.get("postalAddress") as string,
                linkedinProfile: formData.get("linkedinProfile") as string,
                companyOrInstitute: formData.get("companyOrInstitute") as string,
            };

            await AlumniInformationFormSchema.parseAsync(formValues);
            const result = await createAlumniInformationRequest(prevState, formData);

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
                description: "An unexpected error has occurred",
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
        <form action={(formAction)} className="form">
            <div>
                <label htmlFor="fullName" className="form_label">Full Name (As SMVDU Records)</label>
                <Input id="fullName" name="fullName" className="form_input" required placeholder="Enter Your Full Name..." />
                {errors.fullName && <p className="form_error">{errors.fullName}</p>}
            </div>

            <div>
                <label htmlFor="email" className="form_label">Personal Email ID</label>
                <Input id="email" name="email" className="form_input" type="email" required placeholder="Enter Your Email..." />
                {errors.email && <p className="form_error">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="form_label">Your Phone/Whatsapp Numbers</label>
                <Input id="phone" name="phone" className="form_input" required placeholder="Enter Your Contact Number..." />
                {errors.phone && <p className="form_error">{errors.phone}</p>}
            </div>

            <div>
                <label htmlFor="entryNumber" className="form_label">Your Entry Number (As SMVDU Records)</label>
                <Input id="entryNumber" name="entryNumber" className="form_input" required placeholder="Enter Your Entry Number..." />
                {errors.entryNumber && <p className="form_error">{errors.entryNumber}</p>}
            </div>

            <div>
                <label htmlFor="department" className="form_label">Your Department at SMVDU</label>
                <Input id="department" name="department" className="form_input" required placeholder="Enter Your Department..." />
                {errors.department && <p className="form_error">{errors.department}</p>}
            </div>

            <div>
                <label htmlFor="degree" className="form_label">Degree or Type of Program(s) Enrolled in at SMVDU</label>
                <Textarea id="degree" name="degree" className="form_textarea" required placeholder="E.g., B.Tech, M.Tech..." />
                {errors.degree && <p className="form_error">{errors.degree}</p>}
            </div>

            <div>
                <label className="form_label">Your Professional Sector</label>
                <Input id="professionalSector" name="professionalSector" className="form_input" required placeholder="Enter Your Professional Sector..." />
                {errors.professionalSector && <p className="form_error">{errors.professionalSector}</p>}
            </div>


            <div>
                <label htmlFor="countryOfResidence" className="form_label">Current Country of Residence (Domicile)</label>
                <Input id="countryOfResidence" name="countryOfResidence" className="form_input" required placeholder="Enter Your Country..." />
                {errors.countryOfResidence && <p className="form_error">{errors.countryOfResidence}</p>}
            </div>

            <div>
                <label htmlFor="postalAddress" className="form_label">Your Postal Address</label>
                <Textarea id="postalAddress" name="postalAddress" className="form_textarea" required placeholder="Include PINCODE & STATE..." />
                {errors.postalAddress && <p className="form_error">{errors.postalAddress}</p>}
            </div>

            <div>
                <label htmlFor="linkedinProfile" className="form_label">Your Linkedin Profile URL</label>
                <Input id="linkedinProfile" name="linkedinProfile" className="form_input" type="url" required placeholder="Enter Your LinkedIn Profile..." />
                {errors.linkedinProfile && <p className="form_error">{errors.linkedinProfile}</p>}
            </div>

            <div>
                <label htmlFor="companyOrInstitute" className="form_label">Company Or Institute Name</label>
                <Input id="companyOrInstitute" name="companyOrInstitute" className="form_input" required placeholder="Enter Current or In Process Company/Institute..." />
                {errors.companyOrInstitute && <p className="form_error">{errors.companyOrInstitute}</p>}
            </div>

            <Button type="submit" className='form_btn' disabled={isPending}>
                {isPending ? 'Submitting ... ' : 'Submit'}
                <Send className="size-6 ml-2"/>
            </Button>
        </form>
    );
};

export default CampusVisitRequestForm;
