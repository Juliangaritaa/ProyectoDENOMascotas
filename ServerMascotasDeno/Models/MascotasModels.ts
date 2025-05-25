import { conexion } from './conexion.ts';
import { z } from "../Dependencies/dependencias.ts";

interface MascotaData {
    idMascota: number | null;
    nombre: string;
    raza: string
    peso: string;
    idCliente: number;
}

interface ClienteData {
    idCliente: number | null;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password: string;
}

export class Mascota {
    public _objMascota: MascotaData | null;
    public _idMascota: number | null;

    constructor(objMascota: MascotaData | null = null, idMascota: number | null = null) {
        this._objMascota = objMascota;
        this._idMascota = idMascota;
    }

    public async SeleccionarMascota(): Promise<MascotaData[]> {
        const { rows: mascota } = await conexion.execute('SELECT * FROM mascota');
        return mascota as MascotaData[];
    }

    public async SeleccionarClientes(): Promise<ClienteData[]> {
        const { rows: clientes } = await conexion.execute('SELECT idCliente, nombre, apellido FROM cliente');
        return clientes as ClienteData[];
    }

    public async InsertarMascota(): Promise<{ success: boolean; message: string; mascota?: Record<string, unknown> }> {

        try {
            if (!this._objMascota) {
                throw new Error("No se ha proporcionado un objeto de mascota válido");
            }

            const { nombre, raza, peso, idCliente } = this._objMascota;
            if (!nombre || !raza || !peso || !idCliente) {
                throw new Error("Faltan campos requeridos para insertar la información");
            }
            await conexion.execute("START TRANSACTION");
            const result = await conexion.execute('insert into mascota (nombre, raza, peso, idCliente) values (?, ?, ?, ?)', [
                nombre,
                raza,
                peso,
                idCliente,
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [mascota] = await conexion.query('select * from mascota WHERE idMascota = LAST_INSERT_ID()',);
                await conexion.execute("COMMIT");
                return { success: true, message: "Mascota registrada correctamente.", mascota: mascota };
            } else {
                throw new Error("No fué posible registrar la mascota.");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                return { success: false, message: error.message };
            } else {
                return { success: false, message: "Erro interno del servidor" };
            }
        }
    }

    public async ActualizarMascota(): Promise<{success: boolean; message:string; mascota?: Record<string, unknown>}>{

        try {
            
            if (!this._objMascota) {
                throw new Error("No se ha proporcionado un objeto de aprendiz valido")
            }

            const { idMascota,nombre,raza,peso,idCliente } = this._objMascota;

            if (!idMascota) {
                throw new Error("Se requiere el ID del aprendiz para actualizarlo");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
            `UPDATE mascota SET nombre = ?, raza = ?, peso = ?, idCliente = ? WHERE idMascota = ?`,[
                nombre,raza,peso,idCliente,idMascota
            
            ]);

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                
                const [mascota] = await conexion.query(
                    `SELECT * FROM mascota WHERE idMascota = ?`,[idMascota]
                );

                await conexion.execute("COMMIT");

                return{ success: true, message:"Aprendiz Actualizado correctamente",mascota:mascota};
            }else{

                throw new Error("No fue posible actualizar el aprendiz")
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                return {success:false,message: error.message}
            }else{
                return { success: false, message: error.message || "Error interno del servidor" };
            }
        }
    }

    public async EliminarMascota(): Promise<{success: boolean; message:string}>{

        try {
            
            if (!this._objMascota) {
                throw new Error("No se a proporcionado un objeto de aprendiz valido")
                
            }

            const {idMascota} = this._objMascota;

            if (!idMascota) {

                throw new Error("Se requiere el ID del aprendiz para eliminarlo")
                
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
                `DELETE FROM mascota WHERE idMascota = ?`,[idMascota]
            );

            if(result && typeof result.affectedRows === "number" && result.affectedRows > 0){
                await conexion.execute("COMMIT");

                return {
                    success:true,
                    message:"Aprendiz eliminado correctamente"
                };
            }else{
                throw new Error("No fue posible eliminar el usuario o el usuario no existe");
            }

        } catch (error) {
            
            if (error instanceof z.ZodError) {

                return {success:false, message: error.message}
                
            }else{
                return {success:false, message:"Error interno del servidor"}
            }

        }
    }
}