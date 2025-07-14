"use server";

import { auth } from "@/auth";
import slugify from "slugify";
import { z } from "zod";
import connectMongo from "@/lib/mongodb";
import EventModel from "@/MongoDb/models/Event";
import { eventSchema } from "./validation";
import {revalidatePath} from "next/cache";
import { isEventAdmin } from "@/lib/utils";
import path from "path";
import fs from "fs";
import GalleryModel from "@/MongoDb/models/GalleryModel";

type EventFormValues = z.infer<typeof eventSchema>;

export async function createEvent(prevState: any, formValues: EventFormValues) {
  try {
    await eventSchema.parseAsync(formValues);

    const generatedSlug = slugify(`${formValues.title}-${formValues.start_date}`);

    const newEvent = await EventModel.create({
      title: formValues.title,
      slug: generatedSlug,
      start_date: new Date(formValues.start_date),
      end_date: new Date(formValues.end_date),
      location: formValues.location,
      image: formValues.image,
      description: formValues.description,
    });

    revalidatePath("/events");

    return JSON.parse(JSON.stringify({
      status: "SUCCESS",
      slug: newEvent.slug,
      _id: newEvent._id,
    }));
  } catch (error) {
    console.error("[CREATE_EVENT_ERROR]", error);

    return {
      ...prevState,
      error: "Failed to create event.",
      status: "ERROR",
    };
  }
}

export async function getEventById(id: string) {
  await connectMongo();

  try {
    const raw = await EventModel.findById(id).lean();
    if (!raw) return null;

    return {
      ...raw,
      _id: raw._id?.toString(),
      start_date: raw.start_date?.toISOString(),
      end_date: raw.end_date?.toISOString(),
    };
  } catch (error) {
    console.error("[GET_EVENT_ERROR]", error);
    return null;
  }
}

export async function updateEvent(
    eventId: string,
    formValues: Record<string, any>
) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!isEventAdmin(userEmail)) {
    return { status: "ERROR", error: "Unauthorized" };
  }

  await connectMongo();

  try {
    await eventSchema.parseAsync(formValues);

    const generatedSlug = slugify(`${formValues.title}-${formValues.start_date}`);

    const existing = await EventModel.findById(eventId).lean();

    if (existing?.image && existing.image !== formValues.image) {
      const oldImagePath = path.join(process.cwd(), "public/uploads", existing.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
        eventId,
        {
          title: formValues.title,
          slug: generatedSlug,
          start_date: new Date(formValues.start_date),
          end_date: new Date(formValues.end_date),
          location: formValues.location,
          image: formValues.image,
          description: formValues.description,
        },
        { new: true, runValidators: true }
    );

    revalidatePath(`/events/${eventId}`);
    revalidatePath("/events");

    return {
      status: "SUCCESS",
      _id: updatedEvent._id.toString(),
      slug: updatedEvent.slug,
    };
  } catch (error) {
    console.error("[UPDATE_EVENT_ERROR]", error);
    return {
      status: "ERROR",
      error: "Failed to update event.",
    };
  }
}

export async function deleteEvent(id: string) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!isEventAdmin(userEmail)) {
    return { status: "ERROR", error: "Unauthorized" };
  }

  await connectMongo();

  try {
    const existing = await EventModel.findById(id).lean();

    if (existing?.image) {
      const mainImageName = existing.image.startsWith("/uploads/")
          ? existing.image.replace("/uploads/", "")
          : existing.image;

      const mainImagePath = path.join(process.cwd(), "public/uploads", mainImageName);
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
      }
    }

    const galleryImages = await GalleryModel.find({ eventId: id }).lean();

    for (const img of galleryImages) {
      const fileName = path.basename(img.url);
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await GalleryModel.findByIdAndDelete(img._id);
    }

    await EventModel.findByIdAndDelete(id);

    revalidatePath("/events");
    revalidatePath(`/events/${id}`);

    return { status: "SUCCESS" };
  } catch (error) {
    console.error("[DELETE_EVENT_ERROR]", error);
    return { status: "ERROR", error: "Failed to delete event." };
  }
}

export const getGalleryByEventId = async (eventId: string) => {
  await connectMongo();
  const images = await GalleryModel.find({ eventId }).lean();

  return images.map(img => ({
    ...img,
    _id: img._id.toString(),
    eventId: img.eventId.toString(),
    createdAt: img.createdAt?.toISOString(),
    updatedAt: img.updatedAt?.toISOString(),
  }));
};


export const deleteGalleryImage = async (imageId: string) => {
  const session = await auth();
  if (!isEventAdmin(session?.user?.email)) {
    return { status: "ERROR", error: "Unauthorized" };
  }

  await connectMongo();
  const image = await GalleryModel.findById(imageId).lean();
  const eventId = image?.eventId?.toString();

  if (image?.url) {
    const imagePath = path.join(process.cwd(), "public/uploads", path.basename(image.url));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  await GalleryModel.findByIdAndDelete(imageId);
  if (eventId) revalidatePath(`/events/${eventId}`);

  return { status: "SUCCESS", imageId };
};

export const addGalleryImage = async (
    eventId: string,
    imageUrl: string,
    caption?: string
) => {
  const session = await auth();
  if (!isEventAdmin(session?.user?.email)) {
    return { status: "ERROR", error: "Unauthorized" };
  }

  await connectMongo();
  const doc = await GalleryModel.create({ eventId, url: imageUrl, caption });

  const plainDoc = {
    _id: doc._id.toString(),
    eventId: doc.eventId.toString(),
    url: doc.url,
    caption: doc.caption,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };

  revalidatePath(`/events/${doc.eventId}`);

  return { status: "SUCCESS", data: plainDoc };
};
