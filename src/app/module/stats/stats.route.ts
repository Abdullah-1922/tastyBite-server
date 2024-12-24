import express from 'express';
import { StatsController } from './stats.controller';
const router = express.Router();

router.get('/all-stats',StatsController.getAllStats )
router.get('/user-stats/:userId',StatsController.getAllStatsForUSer )
router.get('/top-three-foods',StatsController.getTopThreeFoods )
router.get('/deliveryman-order-stats/:userId',StatsController.deliverymanOrderStats )
export const StatsRoutes = router;