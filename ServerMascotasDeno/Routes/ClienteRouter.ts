import { Router } from "../Dependencies/dependencias.ts";
import { deleteCliente, getCliente, postCLiente, putCliente } from "../Controllers/ClienteController.ts";

const routerCliente = new Router();

routerCliente.get("/clientes", getCliente);
routerCliente.post("/clientes", postCLiente);
routerCliente.put("/clientes", putCliente);
routerCliente.delete("/clientes", deleteCliente)

export { routerCliente };