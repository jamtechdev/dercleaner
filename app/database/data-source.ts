import "reflect-metadata";
import { DataSource } from "typeorm";
import { ContactSubmission } from "./entities/ContactSubmission";
import { SiteConfig } from "./entities/SiteConfig";
import { Product } from "./entities/Product";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "der_cleaner",
  synchronize: process.env.NODE_ENV !== "production", // Auto-sync in dev, use migrations in production
  logging: process.env.NODE_ENV === "development",
  entities: [ContactSubmission, SiteConfig, Product],
  migrations: [], // No migrations for now - using synchronize in dev
  subscribers: [],
});

// Initialize connection
let isInitialized = false;

export async function initializeDatabase() {
  if (!isInitialized) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    isInitialized = true;
  }
  return AppDataSource;
}
