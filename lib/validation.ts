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
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  entryNumber: z.string().min(3).max(20),
  department: z.string().min(3).max(50),
  degree: z.array(z.enum(["Undergraduate (B.Tech)", "Masters (M.Tech)"])),
  professionalSector: z.string().min(3).max(100),
  countryOfResidence: z.string().min(3).max(50),
  postalAddress: z.string().min(10).max(200),
  linkedinProfile: z.string().url().optional(),
  companyOrInstitute: z.string().min(3).max(100),
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
