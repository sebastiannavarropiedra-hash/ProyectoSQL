import { Router } from "express";
import { getData } from "../controllers/controller.js"
import { updateUsuario } from "../controllers/controller.js"
import { getUsuarios } from "../controllers/controller.js"
import { getUsuarioById } from "../controllers/controller.js"
import { deleteLogico } from "../controllers/controller.js"
import { deleteFisico } from "../controllers/controller.js"

const router = Router();

router.get("/test", getData);

//http://localhost:3002/api/test
router.put("/update", updateUsuario);
//http://localhost:3002/api/usuarios
router.get("/usuarios", getUsuarios);
//http://localhost:3002/api/usuarios
router.get("/usuarios/:id", getUsuarioById);
//http://localhost:3002/api/usuarios/
router.delete("/deletelogico/:id", deleteLogico);
//http://localhost:3002/api/deletelogico
router.delete("/deletefisico/", deleteFisico);
//http://localhost:3002/api/deletefisico

export default router;