import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// Transformer to handle JSON serialization/deserialization for complex fields
const jsonTransformer = {
  to: (value: any) => JSON.stringify(value),
  from: (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
};

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  tabTitle!: string;

  @Column({ type: "text", nullable: true })
  tabDesc?: string;

  // Tab image stored as JSON { src: string, alt: string }
  @Column({
    type: "text",
    transformer: jsonTransformer,
  })
  tabImage!: { src: string; alt: string };

  // Hero image stored as JSON { src: string, alt: string }
  @Column({
    type: "text",
    transformer: jsonTransformer,
  })
  heroImage!: { src: string; alt: string };

  // Video stored as JSON { src: string, alt: string } (optional)
  @Column({
    type: "text",
    nullable: true,
    transformer: jsonTransformer,
  })
  video?: { src: string; alt: string };

  // Features image stored as JSON { src: string, alt: string } (optional)
  @Column({
    type: "text",
    nullable: true,
    transformer: jsonTransformer,
  })
  featuresImage?: { src: string; alt: string };

  @Column({ type: "varchar", length: 255 })
  savingsTitle!: string;

  @Column({ type: "varchar", length: 255 })
  savingsSubtitle!: string;

  // Stats stored as JSON array
  @Column({
    type: "text",
    nullable: true,
    transformer: jsonTransformer,
  })
  stats?: { icon: string; label: string; value: string; sub: string }[];

  @Column({ type: "text", nullable: true })
  description?: string;

  // Technical specs stored as JSON object with heading and items
  @Column({
    type: "text",
    nullable: true,
    transformer: jsonTransformer,
  })
  technicalSpecs?: {
    heading?: string;
    items?: { icon?: string; label: string; value: string }[];
  };

  // Features stored as JSON object with heading and items
  @Column({
    type: "text",
    nullable: true,
    transformer: jsonTransformer,
  })
  features?: {
    heading?: string;
    items?: { number: string; title: string; description: string }[];
  };

  @Column({ type: "int", default: 0 })
  displayOrder!: number; // For ordering products

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
