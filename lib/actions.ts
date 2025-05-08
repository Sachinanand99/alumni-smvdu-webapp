"use server"

// import {auth} from "@/auth";
import slugify from "slugify";
import {parseServerActionResponse} from "@/lib/utils";
import { z } from "zod";
import connectMongo from "@/lib/db";
import CampusVisitModel from "@/models/CampusVisit";
import { sendEmail } from "@/lib/email";

const campusVisitSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  batch: z.string().min(2),
  description: z.string().min(10),
});

export const createPitch = async(state: any, form: FormData, pitch: string)=>{
  // const session= await auth();

  // if (!session){
  //   return parseServerActionResponse({error: "Not signed in.", status: "ERROR"});
  // }

  const {title, description, category, link }= Object.fromEntries(
     Array.from(form).filter(([key])=>key !== 'pitch'),
  );

  const slug = slugify(title as string, {lower: true, strict: true});
  try{
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        // _ref: session?.id,
      },
      pitch,
    }

    const result = await writeClient.create({_type: "startup", ...startup});
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  }catch(error){
    console.error(error);
    return parseServerActionResponse({error: JSON.stringify(error), status: "ERROR"});
  }
}

export const createCampusVisitRequest = async (form: FormData) => {
  await connectMongo();

  try {
    const formValues = Object.fromEntries(form.entries());
    const validatedData = campusVisitSchema.parse(formValues);

    // Save to MongoDB
    const newRequest = await CampusVisitModel.create(validatedData);

    // Send Email Notification
    await sendEmail(
        "New Campus Visit Request",
        `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nPhone: ${validatedData.phone}\nBatch: ${validatedData.batch}\nDescription: ${validatedData.description}`
    );

    return { status: "SUCCESS", data: newRequest };
  } catch (error) {
    console.error("Error Creating Campus Visit Request:", error);
    return { status: "ERROR", error: error.message };
  }
};

export const createAlumniInformationRequest = async(state: any, form: FormData)=>{
  console.log("TODO: create CampusVisitRequest");
}

export async function createEvent(prevState: any, formData: FormData, eventDetails: string) {
  // Logic for creating event in database
  return { _id: "123456", status: "SUCCESS" }; // Mocked response for testing
}