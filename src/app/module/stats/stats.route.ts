import express from 'express';
import { StatsController } from './stats.controller';
const router = express.Router();

router.get('/all-stats',StatsController.getAllStats )
router.get('/user-stats/:userId',StatsController.getAllStatsForUSer )

export const StatsRoutes = router;