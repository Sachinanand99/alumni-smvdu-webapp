import { type SchemaTypeDefinition } from 'sanity'
import {user} from "@/sanity/schemaTypes/user";
import { event} from "@/sanity/schemaTypes/event";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, event]
}
