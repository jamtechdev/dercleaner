import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ValueTransformer } from "typeorm";

// Transformer to handle JSON serialization/deserialization
const jsonTransformer: ValueTransformer = {
  to: (value: any) => JSON.stringify(value),
  from: (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
};

@Entity("site_config")
export class SiteConfig {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ 
    type: "longtext", 
    nullable: false,
    transformer: jsonTransformer
  })
  config!: any; // Store entire site.json structure as JSON

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
