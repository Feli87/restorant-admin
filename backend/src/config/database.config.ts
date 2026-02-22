import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres' as const,
    host: configService.get<string>('POSTGRES_HOST', 'localhost'),
    port: configService.get<number>('POSTGRES_PORT', 5432),
    username: configService.get<string>('POSTGRES_USER', 'postgres'),
    password: configService.get<string>('POSTGRES_PASSWORD', 'postgres'),
    database: configService.get<string>('POSTGRES_DB', 'restaurant_admin'),
    autoLoadEntities: true,
    synchronize: configService.get<string>('NODE_ENV', 'development') === 'development',
    logging: configService.get<string>('NODE_ENV', 'development') === 'development',
  }),
};
