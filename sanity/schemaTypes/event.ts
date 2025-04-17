import {defineType, defineField} from "sanity";
import {Album} from 'lucide-react';

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: Album ,
  fields: [
    defineField({
      name: "title",
      type: 'string',
    }),
    defineField({
      name: "slug",
      type: 'slug',
      options: {
        source: 'title'
      }
    }),
    defineField({
      name: "start_date",
      type: 'date',
    }),
    defineField({
      name: "end_date",
      type: 'date',
    }),
    defineField({
      name: "location",
      type: 'string',
    }),
    defineField({
      name: "image",
      type: 'url',
      validation: (Rule)=> Rule.required()
    }),
     defineField({
       name: "attendees",
       type: 'number',
     }),
     defineField({
       name: "views",
       type: "number",
     }),
     defineField({
       name: "description",
       type: "markdown"
     })
  ],
  preview: {
    select: {
      title: "title",
    }
  }
})