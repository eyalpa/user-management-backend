import { Router } from "express";
import { getUsers, patchUsersStatuses } from "../controllers";
import { validate } from "../middlewares/validate.middleware";
import { paginationSchema } from "../validators/pagination";
import { bulkStatusSchema } from "../validators/users";

const router = Router();

router.get("/", validate(paginationSchema), getUsers);
router.patch("/statuses", validate(bulkStatusSchema), patchUsersStatuses);

export { router as usersRouter };
