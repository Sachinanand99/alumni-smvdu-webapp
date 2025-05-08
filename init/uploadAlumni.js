import fs from "fs";
import csv from "csv-parser";
import {createClient} from "next-sanity";

const projectId =  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const apiversion = process.env.;
const token = process.env.SANITY_WRITE_TOKEN;

export const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
    token,
})


const uploadAlumniToSanity = async (alumniData) => {
    try {
        const response = await writeClient.create(alumniData);
        console.log(`Uploaded: ${response._id}`);
    } catch (error) {
        console.error("Error uploading alumni:", error);
    }
};

const processCSV = (filePath) => {
    const alumniRecords = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
            alumniRecords.push({
                _type: "alumni",
                fullName: row["Full Name"],
                email: row["Email ID"] || "",
                phone: row["Phone Number"] || "",
                entryNumber: row["Entry Number"],
                department: row["Department"],
                degree: row["Degree"],
                professionalSector: row["Professional Sector"] || "",
                companyOrInstitute: row["Company Or Institute Name"] || "",
                countryOfResidence: row["Current Country of Residence"] || "",
                postalAddress: row["Postal Address"] || "",
                linkedinProfile: row["LinkedIn Profile URL"] || "",
                twitterProfile: row["Twitter Profile URL"] || "",
            });
        })
        .on("end", async () => {
            console.log("Finished reading CSV. Uploading data...");
            for (const alumni of alumniRecords) {
                await uploadAlumniToSanity(alumni);
            }
            console.log("All records uploaded successfully!");
        });
};

processCSV("init/upload.csv");
