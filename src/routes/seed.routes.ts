import { Router } from "express";
import { seedDatabase } from "../controllers";

const router = Router();

/**
 * @openapi
 * /seed:
 *   post:
 *     summary: Seed the database
 *     responses:
 *       200:
 *         description: Seed completed
 */
router.post("/", seedDatabase);

export { router as seedRouter };
