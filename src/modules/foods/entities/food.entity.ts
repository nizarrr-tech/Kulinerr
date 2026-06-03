import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity('foods')
export class Food {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => Category, (category) => category.foods, { onDelete: 'SET NULL' })
  category!: Category;
}