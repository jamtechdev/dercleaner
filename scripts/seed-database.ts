import "reflect-metadata";
import { config } from "dotenv";
import { seedData } from "../app/database/migrations/seed-data";

// Load environment variables
config();

seedData();
