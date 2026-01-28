import { Router } from "express";
import { getGroups, deleteUserFromGroup } from "../controllers";
import { validate } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/pagination";
import { removeUserFromGroupSchema } from "../validators/groups";

const router = Router();

router.get("/", validate(paginationSchema), getGroups);
router.delete(
  "/:groupId/users/:userId",
  validate(removeUserFromGroupSchema),
  deleteUserFromGroup
);

export { router as groupsRouter };
