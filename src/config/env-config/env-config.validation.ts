import { plainToClass } from 'class-transformer';
import {
  IsDefined,
  IsNumberString,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';
import { Environment } from './env-config.configuration';
class EnvironmentVariables {
  @IsDefined()
  NODE_ENV: Environment;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  PORT: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  DATABASE_URL: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  FLICKER_API_KEY: string;
  @IsDefined()
  @IsString()
  @MinLength(1)
  FLICKER_API_SECRET: string;
}

export function validateEnvConfig(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  if (errors.length) {
    let errorMessage = '';
    for (const err of errors) {
      Object.values(err.constraints).map((msg) => {
        errorMessage += ` ${msg}\n`;
      });
    }
    throw new Error(errorMessage);
  }

  return finalConfig;
}
