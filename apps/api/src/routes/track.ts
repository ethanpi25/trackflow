import type { FastifyInstance } from 'fastify';
import { TrackingService } from '../services/tracking-service.js';
import type Redis from 'ioredis';

export async function trackRoutes(app: FastifyInstance, redis: Redis | null) {
  const trackingService = new TrackingService(redis);

  // Single tracking number query
  app.get<{ Params: { trackingNumber: string }; Querystring: { lang?: string } }>(
    '/api/v1/track/:trackingNumber',
    async (request, reply) => {
      const { trackingNumber } = request.params;

      if (!trackingNumber || trackingNumber.trim().length < 5) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid tracking number',
        });
      }

      const result = await trackingService.track(trackingNumber);

      if (!result) {
        return reply.status(404).send({
          success: false,
          error: 'Tracking number not found',
        });
      }

      return reply.send({
        success: true,
        data: result,
      });
    }
  );

  // Batch tracking query
  app.post<{ Body: { trackingNumbers: string[] } }>(
    '/api/v1/track/batch',
    async (request, reply) => {
      const { trackingNumbers } = request.body ?? {};

      if (!Array.isArray(trackingNumbers) || trackingNumbers.length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'trackingNumbers array is required',
        });
      }

      if (trackingNumbers.length > 50) {
        return reply.status(400).send({
          success: false,
          error: 'Maximum 50 tracking numbers per batch',
        });
      }

      const result = await trackingService.trackBatch(trackingNumbers);

      return reply.send({
        success: true,
        ...result,
      });
    }
  );

  // Health check
  app.get('/api/v1/health', async (_request, reply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      redis: redis ? 'connected' : 'disabled',
    });
  });
}
