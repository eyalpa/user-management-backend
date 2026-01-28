import { Router } from "express";
import { getUsers, patchUsersStatuses } from "../controllers";
import { validate } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/pagination";
import { bulkStatusSchema } from "../validators/users";

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get users with pagination
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0, minimum: 0 }
 *       - in: query
 *         name: extend
 *         schema: { type: boolean, default: false }
 *       - in: query
 *         name: afterId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Users list
 */
router.get("/", validate(paginationSchema), getUsers);

/**
 * @openapi
 * /users/statuses:
 *   patch:
 *     summary: Bulk update user statuses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     status: { type: string, enum: [pending, active, blocked] }
 *     responses:
 *       200:
 *         description: Update result
 */
router.patch("/statuses", validate(bulkStatusSchema), patchUsersStatuses);

export { router as usersRouter };
