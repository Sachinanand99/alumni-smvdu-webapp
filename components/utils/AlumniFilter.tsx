"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SearchFormReset from "./SearchFormReset";
import Form from "next/form";
import {AlumniDocument} from "@/MongoDb/models/Alumni";

const AlumniFilter = ({ query, alumni }: { query?: string, alumni?: AlumniDocument[] }) => {
    const [filter, setFilter] = useState("all");
    const router = useRouter();

    function selectAll() {
        setFilter("all");
        router.push(`/alumni/list-alumni?query=${query || ""}&dept=all`);
    }

    function selectDepartment(dept: string) {
        setFilter(dept);
        router.push(`/alumni/list-alumni?query=${query || ""}&dept=${dept}`);
    }

    function getAlumniCounts(alumni: AlumniDocument[]) {
        const departmentCounts: Record<string, number> = {};

        alumni.forEach(({ department }) => {
            if (department) {
                departmentCounts[department] = (departmentCounts[department] || 0) + 1;
            }
        });

        return departmentCounts;
    }

    const departmentCounts = getAlumniCounts(alumni);
    const totalAlumni = alumni?.length;

    return (
        <div className="basis-[25%] mt-4 ml-4 min-w-[15%]">
            <Form action="/alumni" scroll={false} className="flex flex-1 max-w-sm space-x-2 search-form">
                <Input
                    name="query"
                    defaultValue={query}
                    className="bg-white"
                    placeholder="Search Alumni by Name..."
                />
                <div className="flex gap-2">
                    {query && <SearchFormReset />}
                    <Button type="submit" className="text-white cursor-pointer">
                        <Search className="size-5" />
                    </Button>
                </div>
            </Form>

            <div className="flex flex-col gap-y-2 mt-3 text-color-black">
                <span className="font-semibold">ALUMNI FILTERS</span>

                <div
                    className={`cursor-pointer h-[2.5rem] flex justify-between items-center px-2 border-l-4 ${
                        filter === "all" ? "bg-[#f0f0f0] border-[#71B340] rounded-sm" : "bg-[#DFDFDF] hover:bg-[#71B340] hover:border-[#71B340] rounded-sm"
                    }`}
                    onClick={selectAll}
                >
                    <span>All Alumni</span>
                    <span>({totalAlumni})</span>
                </div>

                {Object.keys(departmentCounts).map((dept) => (
                    <div
                        key={dept}
                        className={`cursor-pointer h-[2.5rem] flex justify-between items-center px-2 border-l-4 ${
                            filter === dept ? "bg-[#f0f0f0] border-[#71B340] rounded-sm" : "bg-[#DFDFDF] hover:bg-[#71B340] hover:border-[#71B340] rounded-sm"
                        }`}
                        onClick={() => selectDepartment(dept)}
                    >
                        <span>{dept}</span>
                        <span>({departmentCounts[dept]})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlumniFilter;