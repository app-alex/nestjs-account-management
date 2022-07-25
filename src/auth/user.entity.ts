import { Account } from '../accounts/account.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  @OneToMany((_type) => Account, (account) => account.user, { eager: true })
  accounts: Account[];
}
