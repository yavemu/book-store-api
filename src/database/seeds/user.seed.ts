import { DataSource } from 'typeorm';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const existingAdmin = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const adminUser = userRepository.create({
        username: 'admin',
        email: 'admin@bookstore.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await userRepository.save(adminUser);
      console.log('✅ Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('Email: admin@bookstore.com');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    const existingUser = await userRepository.findOne({
      where: { username: 'user' },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('user123', 10);

      const regularUser = userRepository.create({
        username: 'user',
        email: 'user@bookstore.com',
        password: hashedPassword,
        role: UserRole.USER,
      });

      await userRepository.save(regularUser);
      console.log('✅ Regular user created successfully');
      console.log('Username: user');
      console.log('Password: user123');
      console.log('Email: user@bookstore.com');
    } else {
      console.log('ℹ️  Regular user already exists');
    }
  }
}