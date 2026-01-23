import "reflect-metadata";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { AppDataSource } from "../data-source";
import { ContactSubmissionRepository } from "../repositories/ContactSubmissionRepository";
import { SiteConfigRepository } from "../repositories/SiteConfigRepository";

async function seedData() {
  try {
    console.log("Initializing database...");
    await AppDataSource.initialize();
    console.log("Database initialized successfully!");

    // Seed Site Config
    const siteConfigPath = path.join(process.cwd(), "app", "content", "site.json");
    try {
      console.log(`Reading site config from: ${siteConfigPath}`);
      const siteConfigRaw = await readFile(siteConfigPath, "utf8");
      const siteConfig = JSON.parse(siteConfigRaw);
      console.log("✓ Site config JSON parsed successfully");
      
      const siteRepo = new SiteConfigRepository();
      const existing = await siteRepo.getConfig();
      
      if (!existing) {
        console.log("No existing config found, saving new config...");
        console.log(`Config size: ${JSON.stringify(siteConfig).length} characters`);
        const saved = await siteRepo.saveConfig(siteConfig);
        console.log(`✓ Site configuration seeded successfully! (ID: ${saved.id})`);
        
        // Verify it was saved
        const verify = await siteRepo.getConfig();
        if (verify) {
          console.log(`✓ Verified: Config retrieved successfully (has ${Object.keys(verify).length} top-level keys)`);
        } else {
          console.error("❌ Warning: Config was saved but could not be retrieved!");
        }
      } else {
        console.log("⚠ Site configuration already exists. Updating with new data...");
        console.log(`Config size: ${JSON.stringify(siteConfig).length} characters`);
        const saved = await siteRepo.saveConfig(siteConfig);
        console.log(`✓ Site configuration updated successfully! (ID: ${saved.id})`);
        
        // Verify it was saved
        const verify = await siteRepo.getConfig();
        if (verify) {
          console.log(`✓ Verified: Config retrieved successfully (has ${Object.keys(verify).length} top-level keys)`);
        } else {
          console.error("❌ Warning: Config was saved but could not be retrieved!");
        }
      }
    } catch (error: any) {
      console.error("❌ Could not seed site config:");
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      if (error?.code) console.error("Error code:", error.code);
    }

    // Seed Contact Submissions
    const submissionsPath = path.join(process.cwd(), "data", "contact-submissions.json");
    try {
      const submissionsRaw = await readFile(submissionsPath, "utf8");
      const submissions = JSON.parse(submissionsRaw);
      
      if (Array.isArray(submissions) && submissions.length > 0) {
        const submissionRepo = new ContactSubmissionRepository();
        const existingCount = await submissionRepo.count();
        
        if (existingCount === 0) {
          for (const sub of submissions) {
            await submissionRepo.create({
              name: sub.name,
              email: sub.email,
              tel: sub.tel || undefined,
              message: sub.message,
            });
          }
          console.log(`✓ Seeded ${submissions.length} contact submissions!`);
        } else {
          console.log(`⚠ Contact submissions already exist (${existingCount}), skipping...`);
        }
      }
    } catch (error) {
      console.log("⚠ Could not seed contact submissions:", error);
    }

    console.log("\n✅ Seeding completed!");
    await AppDataSource.destroy();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedData();
}

export { seedData };
