import { Application, oakCors } from "./ServerMascotasDeno/Dependencies/dependencias.ts";
import { routerCliente } from "./ServerMascotasDeno/Routes/ClienteRouter.ts";
import { routerMascota } from "./ServerMascotasDeno/Routes/MascotaRouter.ts";
const app = new Application();

app.use(oakCors());

const routers = [routerCliente, routerMascota];

routers.forEach((router) => {
    app.use(router.routes());
    app.use(router.allowedMethods());    
});

console.log("Servidor corriendo por el puerto 8000");
app.listen({port:8000});