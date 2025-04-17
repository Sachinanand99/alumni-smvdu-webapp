import { defineQuery } from "next-sanity";

export const EVENT_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current) 
    && (!defined($search) || title match $search)
    && (
      $category == "all" ||
      ($category == "upcoming" && start_date > now()) ||
      ($category == "ongoing" && start_date <= now() && end_date >= now()) ||
      ($category == "past" && end_date < now())
    )
  ] | order(start_date desc) {
    attendees,
    location,
    start_date,
    end_date,
    image,
    title,
    _id,
    description,
    views
  }
`);

export const EVENT_QUERY_ALL = defineQuery(`
*[_type == "event" && defined(slug.current) 
    && (!defined($search) || title match $search)
  ] | order(start_date desc) {
    start_date,
    end_date,
  }
`)

export const EVENT_QUERY_BY_ID =
   defineQuery(`*[_type=="event" && _id == $id][0]{
    attendees,
    location,
    start_date,
    end_date,
    image,
    title,
    _id,
    views,
    description,
}`)

export const EVENT_VIEWS_QUERY =
   defineQuery(` *[_type == "event" && _id == $id][0]{
        _id, views
    }`)