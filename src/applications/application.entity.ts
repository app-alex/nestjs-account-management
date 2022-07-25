import { Account } from '../accounts/account.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  iconPath: string;

  @OneToMany((_type) => Account, (account) => account.application)
  accounts: Account[];
}
