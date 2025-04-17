import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Search} from "lucide-react";

const AlumniFilter = () => {
  return (
     <>
       <div className="flex w-full max-w-sm space-x-2 mt-4 ml-4">
         <Input type="text" placeholder="Search By Title" className="bg-white" />
         <Button type="submit"><Search/></Button>
       </div>
     </>
  )
}
export default AlumniFilter
