"use server"

// import {auth} from "@/auth";
import slugify from "slugify";
import {parseServerActionResponse} from "@/lib/utils";
import { z } from "zod";
import connectMongo from "@/lib/mongodb";
import CampusVisitModel from "@/MongoDb/models/CampusVisit";
import { sendEmail } from "@/lib/email";
import EventModel from "@/MongoDb/models/Event";
import { eventSchema } from "./validation";

const campusVisitSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  batch: z.string().min(2),
  description: z.string().min(10),
});

type EventFormValues = z.infer<typeof eventSchema>;

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

export async function createEvent(prevState: any, formValues: EventFormValues) {
  try {
    // ✅ Validate form values
    await eventSchema.parseAsync(formValues);

    // ✅ Auto-generate slug if not provided
    const generatedSlug = slugify(`${formValues.title}-${formValues.start_date}`);

    // ✅ Save in MongoDB
    const newEvent = await EventModel.create({
      title: formValues.title,
      slug: generatedSlug,
      start_date: new Date(formValues.start_date),
      end_date: new Date(formValues.end_date),
      location: formValues.location,
      image: formValues.image,
      description: formValues.description,
    });

    // ✅ Revalidate path (so page updates if you have static paths)
    revalidatePath("/events");  // adjust your route if needed

    return {
      status: "SUCCESS",
      slug: newEvent.slug,
      _id: newEvent._id,
    };
  } catch (error) {
    console.error("[CREATE_EVENT_ERROR]", error);

    return {
      ...prevState,
      error: "Failed to create event.",
      status: "ERROR",
    };
  }
}
