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
  professionalSector: z.array(z.enum([
    "Employee (MNC/ Medium-Large Enterprise)",
    "Entrepreneur at Scale / Start-Up Founder",
    "Self-Employed Professional/ Freelancer/ Consultant",
    "Academician/ Researcher",
    "Mentor/ Coach",
    "Employee (Small Enterprises <100 People)",
    "Government Employee",
    "Non Profit/ Social Enterprise"
  ])),
  countryOfResidence: z.string().min(3).max(50),
  postalAddress: z.string().min(10).max(200),
  linkedinProfile: z.string().url().optional(),
  companyOrInstitute: z.string().min(3).max(100),
});

