import z from 'zod';

const currentYear = new Date().getFullYear();

export const GuestHouseFormSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  batch: z.string().refine((val) => {
    const batchYear = Number(val);
    return !isNaN(batchYear) && batchYear <= currentYear;
  }, {
    message: `Batch year must be before ${currentYear+1}`
  }),
  description: z.string().min(20).max(500),
  link: z.string().url().refine(async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const contentType = res.headers.get('content-type');
      return contentType?.startsWith('image/');
    } catch {
      return false;
    }
  }),
  pitch: z.string().min(10),
});

export const AlumniInformationFormSchema = z.object({
  fullName: z.string().trim().min(3, "Full Name must be at least 3 characters").max(100, "Full Name cannot exceed 100 characters"),
  email: z.string().trim().email("Invalid Email Format"),
  phone: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  entryNumber: z.string().trim().min(3, "Entry Number must be at least 3 characters").max(20, "Entry Number cannot exceed 20 characters"),
  department: z.string().trim().min(3, "Department must be at least 3 characters").max(50, "Department cannot exceed 50 characters"),
  degree: z.enum([
    "Undergraduate (B.Tech)",
    "Masters (M.Tech)",
    "PhD",
    "Diploma",
    "Postgraduate (M.Sc)"
  ]),
  professionalSector: z.string().trim().min(3, "Professional Sector must be at least 3 characters").max(100, "Professional Sector cannot exceed 100 characters"),
  countryOfResidence: z.string().trim().min(3, "Country of Residence must be at least 3 characters").max(50, "Country cannot exceed 50 characters"),
  postalAddress: z.string().trim().min(10, "Postal Address must be at least 10 characters").max(200, "Postal Address cannot exceed 200 characters"),
  linkedinProfile: z.string().trim().max(100, "LinkedIn ID cannot exceed 100 characters").optional(),
  twitterProfile: z.string().trim().max(100, "Twitter handle cannot exceed 100 characters").optional(),
  companyOrInstitute: z.string().trim().min(3, "Company/Institute must be at least 3 characters").max(100, "Company/Institute cannot exceed 100 characters"),
});

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  start_date: z.string().refine(
      (val) => !isNaN(Date.parse(val)),
      { message: "Start date must be a valid date" }
  ),
  end_date: z.string().refine(
      (val) => !isNaN(Date.parse(val)),
      { message: "End date must be a valid date" }
  ),
  location: z.string().min(3, "Location must be provided"),
  image: z.string().min(1, "Image filename must be provided"),
}).refine(
    (data) => new Date(data.end_date) >= new Date(data.start_date),
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
);
