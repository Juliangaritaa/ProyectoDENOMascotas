import { conexion } from "./conexion.ts";
import { z } from "../Dependencies/dependencias.ts";

interface ClienteData {
  idCliente: number | null;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  password: string;
}

export class Cliente {
  public _objCliente: ClienteData | null;
  public _idCliente: number | null;

  constructor(
    objCliente: ClienteData | null = null,
    idCliente: number | null = null,
  ) {
    this._objCliente = objCliente;
    this._idCliente = idCliente;
  }

  public async SeleccionarCliente(): Promise<ClienteData[]> {
    const { rows: users } = await conexion.execute("select * from cliente");
    return users as ClienteData[];
  }

  public async InsertarCliente(): Promise<
    { success: boolean; message: string; cliente?: Record<string, unknown> }
  > {
    try {
      if (!this._objCliente) {
        throw new Error("No se ha proporcionado un objeto de cliente válido");
      }

      const { nombre, apellido, telefono, email, password } = this._objCliente;

      await conexion.execute("START TRANSACTION");
      const result = await conexion.execute(
        "insert into cliente (nombre, apellido, telefono, email, password) values (?, ?, ?, ?, ?)",
        [
          nombre,
          apellido,
          telefono,
          email,
          password,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [cliente] = await conexion.query(
          "select * from cliente WHERE idCliente = LAST_INSERT_ID()",
        );
        await conexion.execute("COMMIT");
        return {
          success: true,
          message: "Usuario registrado correctamente.",
          cliente: cliente,
        };
      } else {
        throw new Error("No fué posible registrar el cliente.");
      }
    } catch (error: any) {
      console.error("Error al insertar cliente:", error);
      return {
        success: false,
        message: error.message || "Error interno del servidor",
      };
    }
  }

  public async ActualizarCliente(): Promise<{ success: boolean; message: string; cliente?: Record<string, unknown> }> {
    try {
      if (!this._objCliente) {
        throw new Error("No se ha proporcionado un objeto de programa valido")
      }

      const { idCliente, nombre, apellido, telefono, email, password } = this._objCliente;

      if (!idCliente) {
        throw new Error("Se requiere el ID del programa para actualizarlo");
      }

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `UPDATE cliente SET nombre = ?, apellido = ?, telefono = ?, email = ?, password = ? WHERE idCliente = ?`, [
        nombre, apellido, telefono, email, password, idCliente
      ]);

      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {

        const [cliente] = await conexion.query(
          `SELECT * FROM cliente WHERE idCliente = ?`, [idCliente]
        );

        await conexion.execute("COMMIT");
        return { success: true, message: "Programa Actualizado correctamente", cliente: cliente };
      } else {

        throw new Error("No fue posible actualizar el programa")
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, message: error.message }
      } else {
        return { success: false, message: "Error interno del servidor" }
      }
    }
  }

  public async EliminarCliente(): Promise<{ success: boolean; message: string; cliente?: Record<string, unknown> }> {
    try {
      if (!this._objCliente) {
        throw new Error("No se ha proporcionado un objeto de Programa valido.");
      }

      const { idCliente } = this._objCliente;

      if (!idCliente) {
        throw new Error("Faltan campos requeridos");
      }

      await conexion.execute("START TRANSACTION")

      const [existingCliente] = await conexion.query('select * from cliente where idCliente = ?', [idCliente]);


      // Antes de intentar eliminar, verifica si hay fichas que usan el programa
      const { rows: relacionFichas } = await conexion.execute(
        "SELECT * FROM mascota WHERE cliente_idCliente = ?",
        [idCliente]
      );

      if (relacionFichas && relacionFichas.length > 0) {
        await conexion.execute("ROLLBACK");
        return {
          success: false,
          message: "No se puede eliminar el programa porque tiene fichas asociadas"
        };
      }

      if (!existingCliente || existingCliente.length === 0) {
        await conexion.execute("ROLLBACK");
        return {
          success: false,
          message: "No se encontró el programa especificado"
        };
      }

      const result = await conexion.execute('delete from cliente where idCliente = ?', [idCliente]);

      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Programa eliminado exitosamente" };
      } else {
        await conexion.execute("ROLLBACK");
        return { success: false, message: "No fué posible eliminar el programa" };
      }
    } catch (error) {
      await conexion.execute("ROLLBACK");

      if (error instanceof z.ZodError) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "Error interno del servidor" };
      }
    }
  }
}
