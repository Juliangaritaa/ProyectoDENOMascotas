// deno-lint-ignore-file

import { Cliente } from "../Models/ClienteModels.ts";

export const getCliente = async(ctx:any) => {
    const { response } = ctx;

    try {
        const objCliente = new Cliente();
        const listaClientes = await objCliente.SeleccionarCliente();
        response.status = 200;
        response.body = { "success": true, data: listaClientes };
    } catch (error) {
        response.status = 400;
        response.body = { "success": false, msg: "Error al procesar su solicitud", errors: error };
    }
}

export const postCLiente = async (ctx: any) => {
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length"); 
        if (contentLength === "0") {
            response.status = 400;
            response.body = { success: false, msg: "Cuerpo de la solicitud vacío" };
            return;
        }

        const body = await request.body.json(); 
        const clientData = {
            idCliente: null,
            nombre: body.nombre, 
            apellido: body.apellido,
            telefono: body.telefono,
            email: body.email,
            password: body.password,
        };

        const objCliente = new Cliente(clientData);
        const result = await objCliente.InsertarCliente();
        response.status = 200;
        response.body = { success: true, body: result };
    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud" };
    }
};

export const putCliente = async(ctx: any)=>{
    const {response,request} = ctx;

    try{
        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {
            response.status = 400;
            response.body = {success: false,  message: "Cuerpo de la solicitud esta vacio"};
            return;
        }

        const body = await request.body.json();
        
        if (!body.idCliente) {
            response.status = 400;
            response.body = {success: false, message: "Se requiere el ID del programa"};
            return;
        }
        
        if (!body.nombre || !body.apellido || !body.telefono || !body.email || !body.password) {
            response.status = 400;
            response.body = {success: false, message: "Se requiere el nombre del programa"};
            return;
        }
        
        const clientData = {
            idCliente: body.idCliente,
            nombre: body.nombre,
            apellido: body.apellido,
            telefono: body.telefono,
            email: body.email,
            password: body.password,
        }

        const objCliente = new Cliente(clientData);
        const result = await objCliente.ActualizarCliente();
        
        if (!result.success) {
            response.status = 400; 
            response.body = {
                success: false,
                message: result.message
            };
            return;
        }
        
        response.status = 200;
        response.body = {
            success: true,
            data: result.cliente,
            message: result.message
        };

    }catch(error){
        console.error("Error en putPrograma:", error);
        
        response.status = 500;  // Código más apropiado para error interno
        response.body = {
            success: false,
            message: "Error al procesar la solicitud"
        }
    }
};

export const deleteCliente = async(ctx:any)=>{
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (!contentLength || Number(contentLength) === 0) {
            response.status = 400;
            response.body = { success:false,  message:"El cuerpo de la solicitud esta vacio"};
            return;
        }        

        const body = await request.body.json();

        if (!body.idCliente) {
            response.status = 400;
            response.body = {
                success:false,
                message:"id del programa no proporcionado"
            };
            return;
        }

        const clienteData = {
            idCliente: body.idCliente,
            nombre:"",
            apellido:"",
            telefono:"",
            email:"",
            password:"",
        }

        const objCliente = new Cliente(clienteData);
        const result = await objCliente.EliminarCliente();

        if (!result.success) {
            response.status = 404;
            response.body = {success:false,  message:result.message};
            return;
        }

        response.status = 200;
        response.body = {
            success:true,
            message: result.message
        };        

    } catch (error) {
        response.status = 400;
        response.body = {
            success:false,
            message:"Error al borrar el programa",
            errors:error
        }        
    }
};