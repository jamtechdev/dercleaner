import "dotenv/config";
import "reflect-metadata";
import { seedData } from "../app/database/migrations/seed-data";

seedData();
