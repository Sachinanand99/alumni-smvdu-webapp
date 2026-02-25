import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";

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
        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

        const metadata = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetNames = metadata.data.sheets?.map((s) => s.properties?.title) || [];

        const alumniData: any[] = [];

        for (const sheetName of sheetNames) {
            if (!sheetName) continue;

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: sheetName,
            });

            const rows = response.data.values || [];
            if (!rows.length) continue;

            const headers = rows[0];
            const data = rows.slice(1).map((row) => {
                const entry: Record<string, string> = {};
                headers.forEach((header, i) => {
                    entry[header] = row[i] || "";
                });
                return {
                    ...entry,
                    graduationYear: sheetName,
                };
            });

            alumniData.push(...data);
        }

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
        console.error("Error reading Google Sheets:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
