import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

export class ProductRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = AppDataSource.getRepository(Product);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find({
      order: { displayOrder: "ASC", createdAt: "ASC" },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: {
    name: string;
    tabTitle: string;
    tabDesc?: string;
    tabImage: { src: string; alt: string };
    heroImage: { src: string; alt: string };
    video?: { src: string; alt: string };
    featuresImage?: { src: string; alt: string };
    savingsTitle: string;
    savingsSubtitle: string;
    stats?: { icon: string; label: string; value: string; sub: string }[];
    description?: string;
    technicalSpecs?: {
      heading?: string;
      items?: { icon?: string; label: string; value: string }[];
    };
    features?: {
      heading?: string;
      items?: { number: string; title: string; description: string }[];
    };
    displayOrder?: number;
  }): Promise<Product> {
    const product = this.repository.create({
      ...data,
      displayOrder: data.displayOrder ?? 0,
    });
    return this.repository.save(product);
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }
    // Merge the data into the existing product entity
    Object.assign(product, data);
    // Save will properly apply transformers for JSON fields
    return this.repository.save(product);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
