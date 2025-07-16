"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const EventSearchFormReset = () => {
    const reset = () => {
        const form = document.querySelector(".search-form") as HTMLFormElement;

        if (form) {
            form.reset();
        }
    };
    return (
        <Button type="reset" onClick={reset}>
            <Link href="/alumni/list-alumni" className="text-white">
                <XIcon className="size-5"/>
            </Link>
        </Button>
    );
};

export default EventSearchFormReset;
