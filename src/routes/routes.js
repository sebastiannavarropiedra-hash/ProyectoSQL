import { Router } from "express";
import { getData } from "../controllers/controller.js"
import { updateUsuario } from "../controllers/controller.js"
import { getUsuarios } from "../controllers/controller.js"
import { getUsuarioById } from "../controllers/controller.js"

const router = Router();

router.get("/test", getData);
router.put("/update", updateUsuario);
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioById);

export default router;