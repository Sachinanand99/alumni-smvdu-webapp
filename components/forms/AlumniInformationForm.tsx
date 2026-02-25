'use client';

import React, { useEffect, useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { AlumniInformationFormSchema } from "@/lib/validation";
import z from "zod";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";

const getCleanName = (name: string) => {
    return name.split(" ").slice(0, -1).join(" ");
};

const getEntryNumber = (name: string) => {
    return name.split(" ").pop() || "";
};

const getDegreeType = (entryNumber: string) => {
    if (entryNumber.includes("bcs")) return "Undergraduate (B.Tech)";
    if (entryNumber.includes("dcs")) return "PhD";
    return "";
};


const CampusVisitRequestForm = ({ userInfo }) => {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const defaultFormValues = {
        fullName: getCleanName(userInfo?.user?.name || ""),
        email: userInfo?.user?.email || "",
        phone: "",
        entryNumber: getEntryNumber(userInfo?.user?.name || ""),
        gender: "",
        department: "CSE",
        degree: "Undergraduate (B.Tech)",
        professionalSector: "",
        income: "",
        countryOfResidence: "",
        postalAddress: "",
        linkedinProfile: "",
        twitterProfile: "",
        companyOrInstitute: "",
        profilePicture: "",
    };

    const [formValues, setFormValues] = useState(defaultFormValues);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const fetchPrefill = async () => {
            const entry = defaultFormValues.entryNumber;
            if (!entry) return;

            try {
                const res = await fetch(`/api/alumni/excel-info?entry=${entry}`);
                const data = await res.json();
                if (data.found && data.alumni) {
                    setFormValues((prev) => ({
                        ...prev,
                        ...data.alumni,
                        degree: data.alumni.degree?.trim()
                            ? data.alumni.degree
                            : getDegreeType(prev.entryNumber),
                        gender: (() => {
                            const g = data.alumni.gender?.trim().toLowerCase();
                            if (g === "male") return "Male";
                            if (g === "female") return "Female";
                            return "";
                        })(),
                    }));
                }
            } catch (err) {
                console.error("Error fetching alumni data:", err);
            }
        };

        fetchPrefill();
    }, [defaultFormValues.entryNumber]);

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
        const rawValues = Object.fromEntries(formData.entries());
        let imageUrl = "";

        if (imageFile) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", imageFile);

            const uploadRes = await fetch("/api/uploadProfile", {
                method: "POST",
                body: uploadFormData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadData.success) throw new Error("Image upload failed.");

            imageUrl = uploadData.url;
        }

        const formValuesObj = {
            ...rawValues,
            profilePicture: imageUrl,
        };

        await AlumniInformationFormSchema.parseAsync(formValuesObj);

        const response = await fetch("/api/alumni/updateExcelWithAlumniData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formValuesObj),
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            toast("✅ Your request has been recorded successfully.");
            router.push("/");
        } else {
            throw new Error(responseData.error || "Failed to update Google Sheet.");
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            setErrors(error.flatten().fieldErrors as any);
            toast("❌ Please check the highlighted fields and try again.");
            return { status: "ERROR" };
        }

        console.error("Unexpected error during submission:", error);
        toast("❌ Something went wrong while submitting the form.");
        return { status: "ERROR", error: "unexpected failure" };
    }
};


    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        status: "INITIAL",
    });

    return (
        <form action={formAction} className="form">
            <div>
                <label htmlFor="fullName" className="form_label">
                    Full Name (As SMVDU Records)
                </label>
                <Input
                    id="fullName"
                    name="fullName"
                    className="form_input"
                    required
                    value={formValues.fullName}
                    readOnly
                />
                {errors.fullName && <p className="form_error">{errors.fullName}</p>}
            </div>

            <div>
                <label htmlFor="email" className="form_label">
                    Personal Email ID
                </label>
                <Input
                    id="email"
                    name="email"
                    className="form_input"
                    type="email"
                    required
                    value={formValues.email}
                    readOnly
                />
                {errors.email && <p className="form_error">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="form_label">
                    Your Phone/Whatsapp Numbers
                </label>
                <Input
                    id="phone"
                    name="phone"
                    className="form_input"
                    required
                    placeholder="Enter Your Contact Number..."
                    value={formValues.phone}
                    onChange={(e) =>
                        setFormValues({ ...formValues, phone: e.target.value })
                    }
                />
                {errors.phone && <p className="form_error">{errors.phone}</p>}
            </div>

            <div>
                <label htmlFor="profilePicture" className="form_label">Alumni Image</label>
                <Input
                    id="profilePicture"
                    name="profilePicture"
                    className="form_profilePic_input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {errors.profilePicture && <p className="form_error">{errors.profilePicture}</p>}
            </div>


            <div>
                <label htmlFor="entryNumber" className="form_label">
                    Your Entry Number
                </label>
                <Input
                    id="entryNumber"
                    name="entryNumber"
                    className="form_input"
                    required
                    value={formValues.entryNumber}
                    readOnly
                />
                {errors.entryNumber && (
                    <p className="form_error">{errors.entryNumber}</p>
                )}
            </div>

            <div>
                <label htmlFor="gender" className="form_label">
                    Gender
                </label>
                <select
                    id="gender"
                    name="gender"
                    className="form_input !py-3 !mx-3"
                    required
                    value={formValues.gender}
                    onChange={(e) =>
                        setFormValues({ ...formValues, gender: e.target.value })
                    }
                >
                    <option value="" disabled>
                        Select Your Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="form_error">{errors.gender}</p>}
            </div>

            <div>
                <label htmlFor="department" className="form_label">Your Department at SMVDU</label>
                <Input
                    id="department"
                    name="department"
                    className="form_input"
                    required
                    readOnly
                    placeholder="Enter Your Department..."
                    value={formValues.department}
                    onChange={(e) => setFormValues({ ...formValues, department: e.target.value })}
                />
                {errors.department && <p className="form_error">{errors.department}</p>}
            </div>

            <div>
                <label htmlFor="degree" className="form_label">Degree or Type of Program(s) Enrolled in at SMVDU</label>
                <Input
                    id="degree"
                    name="degree"
                    className="form_input"
                    required
                    placeholder="E.g., B.Tech, M.Tech..."
                    value={
                        formValues.degree?.trim() === ""
                            ? getDegreeType(formValues.entryNumber)
                            : formValues.degree
                    }
                    readOnly
                />
                {errors.degree && <p className="form_error">{errors.degree}</p>}
            </div>

            <div>
                <label className="form_label">Your Professional Sector</label>
                <Input
                    id="professionalSector"
                    name="professionalSector"
                    className="form_input"
                    required
                    placeholder="Enter Your Professional Sector..."
                    value={formValues.professionalSector}
                    onChange={(e) => setFormValues({ ...formValues, professionalSector: e.target.value })}
                />
                {errors.professionalSector && <p className="form_error">{errors.professionalSector}</p>}
            </div>

            <div>
                <label className="form_label">Your Income (CTC)</label>
                <Input
                    id="income"
                    name="income"
                    className="form_input"
                    required
                    placeholder="Enter Your Income..."
                    value={formValues.income}
                    onChange={(e) => setFormValues({ ...formValues, income: e.target.value })}
                />
                {errors.income && <p className="form_error">{errors.income}</p>}
            </div>

            <div>
                <label htmlFor="countryOfResidence" className="form_label">Current Country of Residence (Domicile)</label>
                <Input
                    id="countryOfResidence"
                    name="countryOfResidence"
                    className="form_input"
                    required
                    placeholder="Enter Your Country..."
                    value={formValues.countryOfResidence}
                    onChange={(e) => setFormValues({ ...formValues, countryOfResidence: e.target.value })}
                />
                {errors.countryOfResidence && <p className="form_error">{errors.countryOfResidence}</p>}
            </div>

            <div>
                <label htmlFor="postalAddress" className="form_label">Your Postal Address</label>
                <Textarea
                    id="postalAddress"
                    name="postalAddress"
                    className="form_textarea"
                    required
                    placeholder="Include PINCODE & STATE..."
                    value={formValues.postalAddress}
                    onChange={(e) => setFormValues({ ...formValues, postalAddress: e.target.value })}
                />
                {errors.postalAddress && <p className="form_error">{errors.postalAddress}</p>}
            </div>

            <div>
                <label htmlFor="linkedinProfile" className="form_label">Your LinkedIn Profile URL</label>
                <Input
                    id="linkedinProfile"
                    name="linkedinProfile"
                    className="form_input"
                    placeholder="Enter Your LinkedIn Profile..."
                    value={formValues.linkedinProfile}
                    onChange={(e) => setFormValues({ ...formValues, linkedinProfile: e.target.value })}
                />
                {errors.linkedinProfile && <p className="form_error">{errors.linkedinProfile}</p>}
            </div>

            <div>
                <label htmlFor="twitterProfile" className="form_label">Your Twitter Profile URL</label>
                <Input
                    id="twitterProfile"
                    name="twitterProfile"
                    className="form_input"
                    placeholder="Enter Your Twitter Profile..."
                    value={formValues.twitterProfile}
                    onChange={(e) => setFormValues({ ...formValues, twitterProfile: e.target.value })}
                />
                {errors.twitterProfile && <p className="form_error">{errors.twitterProfile}</p>}
            </div>

            <div>
                <label htmlFor="companyOrInstitute" className="form_label">Company Or Institute Name</label>
                <Input
                    id="companyOrInstitute"
                    name="companyOrInstitute"
                    className="form_input"
                    required
                    placeholder="Enter Current or In Process Company/Institute..."
                    value={formValues.companyOrInstitute}
                    onChange={(e) => setFormValues({ ...formValues, companyOrInstitute: e.target.value })}
                />
                {errors.companyOrInstitute && <p className="form_error">{errors.companyOrInstitute}</p>}
            </div>


            <Button type="submit" className="form_btn" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
                <Send className="size-6 ml-2" />
            </Button>
        </form>
    );
};

export default CampusVisitRequestForm;
