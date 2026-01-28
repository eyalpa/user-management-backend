import { Router } from "express";
import { getGroups, deleteUserFromGroup } from "../controllers";
import { validate } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/pagination";
import { removeUserFromGroupSchema } from "../validators/groups";

const router = Router();

/**
 * @openapi
 * /groups:
 *   get:
 *     summary: Get groups with pagination
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0, minimum: 0 }
 *       - in: query
 *         name: afterId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Groups list
 */
router.get("/", validate(paginationSchema), getGroups);

/**
 * @openapi
 * /groups/{groupId}/users/{userId}:
 *   delete:
 *     summary: Remove user from group
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Removed
 */
router.delete(
  "/:groupId/users/:userId",
  validate(removeUserFromGroupSchema),
  deleteUserFromGroup
);

export { router as groupsRouter };
