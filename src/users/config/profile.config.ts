import { registerAs } from '@nestjs/config';

export default registerAs('profileConfig', () => ({
  apiKey: process.env.PROFILE_API_KEY,
  apiVersion: process.env.API_VERSION,
}));
