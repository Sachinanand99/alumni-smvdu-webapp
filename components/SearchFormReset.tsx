"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const SearchFormReset = () => {
  const reset = () => {
    const form = document.querySelector(".search-form") as HTMLFormElement;

    if (form) {
      form.reset();
    }
  };
  return (
     <Button type="reset" onClick={reset}>
       <Link href="/events" className="text-white">
         <XIcon className="size-5"/>
       </Link>
     </Button>
  );
};

export default SearchFormReset;
