import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { ContactSubmission } from "../entities/ContactSubmission";

export class ContactSubmissionRepository {
  private repository: Repository<ContactSubmission>;

  constructor() {
    this.repository = AppDataSource.getRepository(ContactSubmission);
  }

  async findAll(): Promise<ContactSubmission[]> {
    return this.repository.find({
      order: { createdAt: "DESC" },
    });
  }

  async findById(id: string): Promise<ContactSubmission | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: {
    name: string;
    email: string;
    tel?: string;
    message: string;
  }): Promise<ContactSubmission> {
    const submission = this.repository.create(data);
    return this.repository.save(submission);
  }

  async deleteAll(): Promise<void> {
    await this.repository.clear();
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
