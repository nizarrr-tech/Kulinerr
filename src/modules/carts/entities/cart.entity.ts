import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Food } from '../../foods/entities/food.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @ManyToOne(() => User)
  customer!: User;

  @ManyToOne(() => Food, { onDelete: 'CASCADE' })
  food!: Food;

  @CreateDateColumn()
  createdAt!: Date;
}