import { Router } from 'express';

export const createApiRoutes = (queueService, sessionService) => {
  const router = Router();

  router.get('/health', (req, res) => {
    const stats = queueService.getQueueStats();
    res.json({ 
      status: 'OK', 
      ...stats,
      activeSessions: sessionService.getSessionCount()
    });
  });

  router.get('/debug', (req, res) => {
    const queueDebug = queueService.getDebugInfo();
    const sessions = sessionService.getAllSessions();
    res.json({
      ...queueDebug,
      activeSessions: sessions
    });
  });

  return router;
};