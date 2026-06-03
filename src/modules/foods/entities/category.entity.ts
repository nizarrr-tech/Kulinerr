import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Food } from './food.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => Food, (food) => food.category)
  foods!: Food[];
}