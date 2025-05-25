import { Router } from "../Dependencies/dependencias.ts";
import { getMascota, postMascota, getClienteId, putMascota, deleteMascota } from '../Controllers/MascotaController.ts';

const routerMascota = new Router();

routerMascota.get("/test", (ctx) => {ctx.response.body = { msg: "Funciona" };});
routerMascota.get("/mascotas", getMascota);
routerMascota.get("/clienteId", getClienteId);
routerMascota.post("/mascotas", postMascota);
routerMascota.put("/mascotas", putMascota);
routerMascota.delete("/mascotas", deleteMascota)

export { routerMascota };