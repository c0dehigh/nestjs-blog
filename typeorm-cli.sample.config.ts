import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'nestjs-blog',
  entities: ['**/*.entity.js'],
  migrations: ['migrations/*.js'],
});
