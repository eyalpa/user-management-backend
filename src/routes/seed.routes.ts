import { Router } from "express";
import { seedDatabase } from "../controllers";

const router = Router();

router.post("/", seedDatabase);

export { router as seedRouter };
