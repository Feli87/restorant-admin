import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

const logger = new Logger('JwtConfig');

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const secret = configService.get<string>('JWT_SECRET');
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');

    if (!secret && nodeEnv === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }

    if (!secret) {
      logger.warn('JWT_SECRET not set — using default. DO NOT use in production!');
    }

    return {
      secret: secret || 'super-secret-key-change-in-production',
      signOptions: {
        expiresIn: configService.get<string>('JWT_EXPIRATION', '24h') as `${number}${'s' | 'm' | 'h' | 'd'}`,
      },
    };
  },
};
