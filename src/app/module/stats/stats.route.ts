import express from 'express';
import { StatsController } from './stats.controller';
const router = express.Router();

router.get('/all-stats',StatsController.getAllStats )

export const StatsRoutes = router;