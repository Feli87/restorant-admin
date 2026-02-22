import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity!: number;

  @Column({ type: 'varchar', length: 50 })
  unit!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_stock!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  unit_cost!: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
