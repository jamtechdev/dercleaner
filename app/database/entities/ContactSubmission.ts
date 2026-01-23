import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("contact_submissions")
export class ContactSubmission {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  tel?: string;

  @Column({ type: "text" })
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
