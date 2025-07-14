import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";
import { NextResponse } from "next/server";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_GEOCODING_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

async function fetchAlumniCoordinates(alumniData: any[]) {
    const geoDataPromises = alumniData.map(async (alumnus) => {
        if (!alumnus.postalAddress) return null;

        try {
            const response = await fetch(
                `${MAPBOX_GEOCODING_URL}${encodeURIComponent(alumnus.postalAddress)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
            );

            if (!response.ok) return null;

            const data = await response.json();

            if (data?.features?.length > 0) {
                return {
                    name: alumnus.name,
                    postalAddress: alumnus.postalAddress,
                    coordinates: data.features[0].geometry.coordinates,
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    });

    return (await Promise.all(geoDataPromises)).filter((item) => item !== null);
}

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "public/data.xlsx");

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });

        const alumniData: any[] = [];
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) return;
            const sheetData = xlsx.utils.sheet_to_json(sheet);
            alumniData.push(...sheetData.map(entry => ({
                ...entry,
                graduationYear: sheetName,
            })));
        });

        const geoData = await fetchAlumniCoordinates(alumniData);

        return NextResponse.json({
            type: "FeatureCollection",
            features: geoData.map((alumnus) => ({
                type: "Feature",
                geometry: { type: "Point", coordinates: alumnus.coordinates },
                properties: { name: alumnus.name, location: alumnus.postalAddress },
            })),
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}