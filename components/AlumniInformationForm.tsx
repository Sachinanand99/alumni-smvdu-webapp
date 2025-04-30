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
        <form action={(formAction)} className="campus-visit-form">
            <div>
                <label htmlFor="fullName" className="form-label">Full Name (As SMVDU Records)</label>
                <Input id="fullName" name="fullName" className="form-input" required placeholder="Enter Your Full Name..." />
                {errors.fullName && <p className="form-error">{errors.fullName}</p>}
            </div>

            <div>
                <label htmlFor="email" className="form-label">Email ID</label>
                <Input id="email" name="email" className="form-input" type="email" required placeholder="Enter Your Email..." />
                {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="form-label">Your Phone/Whatsapp Numbers</label>
                <Input id="phone" name="phone" className="form-input" required placeholder="Enter Your Contact Number..." />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>

            <div>
                <label htmlFor="entryNumber" className="form-label">Your Entry Number (As SMVDU Records)</label>
                <Input id="entryNumber" name="entryNumber" className="form-input" required placeholder="Enter Your Entry Number..." />
                {errors.entryNumber && <p className="form-error">{errors.entryNumber}</p>}
            </div>

            <div>
                <label htmlFor="department" className="form-label">Your Department at SMVDU</label>
                <Input id="department" name="department" className="form-input" required placeholder="Enter Your Department..." />
                {errors.department && <p className="form-error">{errors.department}</p>}
            </div>

            <div>
                <label htmlFor="degree" className="form-label">Degree or Type of Program(s) Enrolled in at SMVDU</label>
                <Textarea id="degree" name="degree" className="form-textarea" required placeholder="E.g., B.Tech, M.Tech..." />
                {errors.degree && <p className="form-error">{errors.degree}</p>}
            </div>

            <div>
                <label className="form-label">Your Professional Sector</label>
                <fieldset className="form-checkbox-group">
                    <legend>Select all that apply:</legend>
                    {[
                        "Employee (MNC/ Medium-Large Enterprise)",
                        "Entrepreneur at Scale / Start-Up Founder",
                        "Self-Employed Professional/ Freelancer/ Consultant",
                        "Academician/ Researcher",
                        "Mentor/ Coach",
                        "Employee (Small Enterprises <100 People)",
                        "Government Employee",
                        "Non Profit/ Social Enterprise",
                    ].map((sector) => (
                        <div key={sector}>
                            <input type="checkbox" id={sector} name="professionalSector" value={sector} />
                            <label htmlFor={sector}>{sector}</label>
                        </div>
                    ))}
                </fieldset>
                {errors.professionalSector && <p className="form-error">{errors.professionalSector}</p>}
            </div>


            <div>
                <label htmlFor="countryOfResidence" className="form-label">Current Country of Residence (Domicile)</label>
                <Input id="countryOfResidence" name="countryOfResidence" className="form-input" required placeholder="Enter Your Country..." />
                {errors.countryOfResidence && <p className="form-error">{errors.countryOfResidence}</p>}
            </div>

            <div>
                <label htmlFor="postalAddress" className="form-label">Your Postal Address</label>
                <Textarea id="postalAddress" name="postalAddress" className="form-textarea" required placeholder="Include PINCODE & STATE..." />
                {errors.postalAddress && <p className="form-error">{errors.postalAddress}</p>}
            </div>

            <div>
                <label htmlFor="linkedinProfile" className="form-label">Your Linkedin Profile URL</label>
                <Input id="linkedinProfile" name="linkedinProfile" className="form-input" type="url" required placeholder="Enter Your LinkedIn Profile..." />
                {errors.linkedinProfile && <p className="form-error">{errors.linkedinProfile}</p>}
            </div>

            <div>
                <label htmlFor="companyOrInstitute" className="form-label">Company Or Institute Name</label>
                <Input id="companyOrInstitute" name="companyOrInstitute" className="form-input" required placeholder="Enter Current or In Process Company/Institute..." />
                {errors.companyOrInstitute && <p className="form-error">{errors.companyOrInstitute}</p>}
            </div>

            <Button type="submit" className='form-btn' disabled={isPending}>
                {isPending ? 'Submitting ... ' : 'Submit'}
                <Send className="size-6 ml-2"/>
            </Button>
        </form>
    );
};

export default CampusVisitRequestForm;
