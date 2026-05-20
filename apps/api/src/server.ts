import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from 'dotenv';
import Redis from 'ioredis';
import { trackRoutes } from './routes/track.js';
import { buyerAgentRoutes } from './routes/buyer-agent.js';

config(); // Load .env

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const HOST = process.env.HOST ?? '0.0.0.0';

async function main() {
  const app = Fastify({ logger: true });

  // CORS
  await app.register(cors, { origin: true });

  // Rate limiting
  await app.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
  });

  // Redis connection (optional - gracefully degrade if unavailable)
  let redis: Redis | null = null;
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 2000)),
      });
      redis.on('error', () => {
        app.log.warn('Redis connection error, running without cache');
        redis = null;
      });
      await redis.ping();
      app.log.info('Redis connected');
    } catch {
      app.log.warn('Redis not available, running without cache');
      redis = null;
    }
  } else {
    app.log.info('No REDIS_URL configured, running without cache');
  }

  // Register routes
  await trackRoutes(app, redis);
  await buyerAgentRoutes(app);

  // Start server
  await app.listen({ port: PORT, host: HOST });
  app.log.info(`API server running at http://${HOST}:${PORT}`);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
