import { Router } from "express";
import { rootController } from "../controllers/root.controller.js";
import { healthRoutes } from "./health.routes.js";
import { contactRoutes } from "./contact.routes.js";
import { chatRoutes } from "./chat.routes.js";

export const apiRoutes: Router = Router();

apiRoutes.get("/", rootController.welcome);
apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/api/contact", contactRoutes);
apiRoutes.use("/api/chat", chatRoutes);
