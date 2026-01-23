import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { SiteConfig } from "../entities/SiteConfig";

export class SiteConfigRepository {
  private repository: Repository<SiteConfig>;

  constructor() {
    this.repository = AppDataSource.getRepository(SiteConfig);
  }

  async getConfig(): Promise<any> {
    const config = await this.repository.find({
      order: { updatedAt: "DESC" },
      take: 1,
    });
    if (!config || config.length === 0) return null;
    
    const latestConfig = config[0];
    // Ensure config is properly parsed
    if (typeof latestConfig.config === 'string') {
      try {
        latestConfig.config = JSON.parse(latestConfig.config);
      } catch (e) {
        console.error("Error parsing config JSON:", e);
      }
    }
    return latestConfig.config;
  }

  async saveConfig(configData: any): Promise<SiteConfig> {
    // Get existing config or create new
    const existing = await this.repository.find({
      order: { updatedAt: "DESC" },
      take: 1,
    });

    let config: SiteConfig;
    if (!existing || existing.length === 0) {
      config = this.repository.create({ config: configData });
    } else {
      config = existing[0];
      config.config = configData;
    }

    const saved = await this.repository.save(config);
    // Ensure config is properly parsed after save
    if (typeof saved.config === 'string') {
      saved.config = JSON.parse(saved.config);
    }
    return saved;
  }

  async updateConfig(updates: Partial<any>): Promise<SiteConfig> {
    const current = await this.getConfig();
    const updated = { ...current, ...updates };
    return this.saveConfig(updated);
  }
}
