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
    technicalSpecs?: { icon?: string; label: string; value: string }[];
    features?: { number: string; title: string; description: string }[];
    displayOrder?: number;
  }): Promise<Product> {
    const product = this.repository.create({
      ...data,
      displayOrder: data.displayOrder ?? 0,
    });
    return this.repository.save(product);
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
