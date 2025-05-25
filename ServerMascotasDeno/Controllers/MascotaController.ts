// deno-lint-ignore-file

import { Mascota } from '../Models/MascotasModels.ts';

export const getMascota = async (ctx: any) => {
    console.log("GET /mascotas fue llamado");
    try {
        const objMascota = new Mascota();
        const listaMascotas = await objMascota.SeleccionarMascota();
        ctx.response.status = 200;
        ctx.response.body = { success: true, data: listaMascotas };
    } catch (error) {
        console.error("Error en getMascota:", error);
        ctx.response.status = 400;
        ctx.response.body = { success: false, msg: "Error al procesar su solicitud", errors: error.message };
    }
};

export const getClienteId = async (ctx: any) => {
    try {
        const objMascota = new Mascota();
        const listaMascotas = await objMascota.SeleccionarClientes();
        ctx.response.status = 200;
        ctx.response.body = { success: true, data: listaMascotas };
    } catch (error) {
        console.error("Error en getMascota:", error);
        ctx.response.status = 400;
        ctx.response.body = { success: false, msg: "Error al procesar su solicitud", errors: error.message };
    }
};

export const postMascota = async (ctx: any) => {
    const { response, request } = ctx;

    try {

        const contenLenght = request.headers.get("Content-Lenght")
        if (contenLenght === "0") {
            response.status = 400;
            response.body = { success: false, msg: "cuerpo de la solicitud esta vacio" }
            return;
        }

        const body = await request.body.json();
        const mascotaData = {
            idMascota: null,
            nombre: body.nombre,
            peso: body.peso,
            raza: body.raza,
            idCliente: body.idCliente,
        }

        const objMascota = new Mascota(mascotaData);
        const result = await objMascota.InsertarMascota();
        response.status = 200;
        response.body = { success: true, body: result, };

    } catch (error) {
        response.status = 400;
        response.body = { success: false, msg: "Error al procesar la solicitud" };
    }
}

export const putMascota = async(ctx: any)=>{
    const {response,request} = ctx;

    try{

        const contentLength = request.headers.get("Content-Length");

        if (contentLength === "0") {

            response.status = 400;
            response.body = {success: false,  message: "Cuerpo de la solicitud esta vacio"};
            return;
            
        }

        const body = await request.body.json();

        const mascotaData = {
            idMascota: null,
            nombre: body.nombre,
            peso: body.peso,
            raza: body.raza,
            idCliente: body.idCliente,
        }

        const objMascota = new Mascota(mascotaData);
        const result = await objMascota.ActualizarMascota();
        response.status = 200;
        response.body = {
            success:true,
            body:result,
        };

    }catch(error){
        response.status = 400;
        response.body = {
            success:false,
            message:"Error al procesar la solicitud"
        }
    }   
};

export const deleteMascota = async(ctx:any)=>{
    const { response, request } = ctx;

    try {
        const contentLength = request.headers.get("Content-Length");
        if (!contentLength || Number(contentLength) === 0) {
            response.status = 400;
            response.body = { success:false,  message:"El cuerpo de la solicitud esta vacio"};
            return;
        }        

        const body = await request.body.json();

        if (!body.idMascota) {
            response.status = 400;
            response.body = {
                success:false,
                message:"id del programa no proporcionado"
            };
            return;
        }

        const mascotaData = {
            idMascota: body.idMascota,
            nombre:"",
            peso:"",
            raza:"",
            idCliente:body.idCliente,
        }

        const objCliente = new Mascota(mascotaData);
        const result = await objCliente.EliminarMascota();

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
}