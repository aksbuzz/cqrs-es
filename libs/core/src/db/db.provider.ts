import Redis from 'ioredis';
import { Pool } from 'pg';
import { POSTGRES_CONNECTION, REDIS_CONNECTION } from '../types';

export const dbProviders = [
  {
    provide: REDIS_CONNECTION,
    useFactory: () => {
      const client = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      });
      client.on('ready', () => console.log('Redis Client Connected'));
      client.on('error', (err) => console.error('Redis Client Error', err));

      return client;
    },
  },
  {
    provide: POSTGRES_CONNECTION,
    useFactory: () => {
      const pool = new Pool({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        user: 'postgres',
        password: 'postgres',
        database: 'es',
      });

      pool.on('connect', () => console.log('Postgres Client Connected'));
      pool.on('error', (err) => console.error('Postgres Client Error', err));

      return pool;
    },
  },
];
