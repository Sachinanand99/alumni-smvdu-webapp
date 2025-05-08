import cron from "node-cron";
import { generateExcelFiles } from "@/lib/excel";

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled Excel update...");
    await generateExcelFiles();
});
