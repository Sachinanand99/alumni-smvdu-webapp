"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Form from "next/form";
import { AlumniDocument } from "@/MongoDb/models/Alumni";
import AlumniSearchFormReset from "@/components/utils/AlumniSearchFormReset";

const AlumniFilter = ({ query, alumni }: { query?: string; alumni?: AlumniDocument[] }) => {
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
        (alumni || []).forEach(({ department }) => {
            if (department) {
                departmentCounts[department] = (departmentCounts[department] || 0) + 1;
            }
        });
        return departmentCounts;
    }

    const departmentCounts = getAlumniCounts(alumni);
    const totalAlumni = alumni?.length || 0;

    return (
        <div className="w-full lg:w-auto lg:basis-[30%] px-4 lg:px-0 flex justify-center lg:justify-start">
            <div className="w-full max-w-md lg:max-w-none">
                <Form
                    action="/alumni/list-alumni"
                    scroll={false}
                    className="flex flex-col sm:flex-row sm:space-x-2 gap-2 w-full"
                >
                    <Input
                        name="query"
                        defaultValue={query}
                        className="bg-white flex-1"
                        placeholder="Search Alumni by Name..."
                    />
                    <div className="flex gap-2 items-center">
                        {query && <AlumniSearchFormReset />}
                        <Button type="submit" className="text-white cursor-pointer">
                            <Search className="size-5" />
                        </Button>
                    </div>
                </Form>

                {/* Dropdown for small screens */}
                {/*<div className="lg:hidden mt-4">*/}
                {/*    <label className="block mb-1 font-semibold">Department Filter</label>*/}
                {/*    <select*/}
                {/*        value={filter}*/}
                {/*        onChange={(e) => selectDepartment(e.target.value)}*/}
                {/*        className="w-full p-2 border rounded-sm bg-white text-black"*/}
                {/*    >*/}
                {/*        <option value="all">All Alumni ({totalAlumni})</option>*/}
                {/*        {Object.keys(departmentCounts).map((dept) => (*/}
                {/*            <option key={dept} value={dept}>*/}
                {/*                {dept} ({departmentCounts[dept]})*/}
                {/*            </option>*/}
                {/*        ))}*/}
                {/*    </select>*/}
                {/*</div>*/}

                {/* Full list for large screens */}
                <div className="hidden lg:block mt-3">
                    <div className="flex flex-col gap-y-2 text-color-black">
                        <span className="font-semibold">ALUMNI FILTERS</span>

                        <div
                            className={`cursor-pointer h-[2.5rem] flex justify-between items-center px-2 border-l-4 ${
                                filter === "all"
                                    ? "bg-[#f0f0f0] border-[#71B340] rounded-sm"
                                    : "bg-[#DFDFDF] hover:bg-[#71B340] hover:border-[#71B340] rounded-sm"
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
                                    filter === dept
                                        ? "bg-[#f0f0f0] border-[#71B340] rounded-sm"
                                        : "bg-[#DFDFDF] hover:bg-[#71B340] hover:border-[#71B340] rounded-sm"
                                }`}
                                onClick={() => selectDepartment(dept)}
                            >
                                <span>{dept}</span>
                                <span>({departmentCounts[dept]})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlumniFilter;
