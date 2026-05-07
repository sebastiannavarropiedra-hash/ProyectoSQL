import { getConnection, sql, } from "../models/connection.js";

export const getData = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT 1 AS test");
    res.json(result.recordset);
};

//SP CREATE

export const crearUsuario = async (request, result) => {

    try {

        const { ID_Usuario, Nombre_Usuario, Credencial_Espacial, ID_Perfil } = request.body;

        // Validaciones
        if (!ID_Usuario || !Nombre_Usuario || !Credencial_Espacial || !ID_Perfil) {

            return result.status(400).json({
                resultado_tipo: "warning",
                respuesta_detalle: "Todos los campos son obligatorios",
                datos: "",
                descripcion: "Validación de datos"
            });

        }

        // Validar números
        if (isNaN(ID_Usuario) || isNaN(ID_Perfil)) {

            return result.status(400).json({
                resultado_tipo: "warning",
                respuesta_detalle: "ID_Usuario e ID_Perfil deben ser numéricos",
                datos: "",
                descripcion: "Validación de tipos de datos"
            });

        }

        const pool = await getConnection();

        const resultado = await
            pool
                .request()
                .input("ID_Usuario", sql.Int, ID_Usuario)
                .input("Nombre_Usuario", sql.NVarChar, Nombre_Usuario)
                .input("Credencial_Espacial", sql.NVarChar, Credencial_Espacial)
                .input("ID_Perfil", sql.Int, ID_Perfil)
                .execute("SP_ActualizarUsuarios");

        const descripcion = "Endpoint que permite actualizar usuarios";

        let resultadoCompleto = {
            resultado_tipo: resultado.recordsets[0][0].msj_tipo,
            respuesta_detalle: resultado.recordsets[0][0].msj_texto,
            datos: "",
            descripcion: descripcion
        };

        return result.json(resultadoCompleto);

    }
    catch (error) {

        console.log(request.body);
        console.log(error);

        result.status(500).json({
            resultado_tipo: "error",
            respuesta_detalle: error.message,
            datos: "",
            descripcion: "Error interno del servidor"
        });

    }

};
//SP READ
export const getUsuarios = async (request, result) => {

    try {

        const pool = await getConnection();

        const respuesta = await
            pool
                .request()
                .execute("SP_LeerUsuarios");

        const descripcion = "Endpoint que permite consultar todos los usuarios";

        const resultadoCompleto = {
            resultado_tipo: respuesta.recordsets[1][0].msj_tipo,
            respuesta_detalle: respuesta.recordsets[1][0].msj_texto,
            datos: respuesta.recordsets[0] || [],
            descripcion: descripcion
        };

        return result.json(resultadoCompleto);

    }
    catch (error) {

        console.log(error);

        return result.status(500).json({
            resultado_tipo: "error",
            respuesta_detalle: error.message,
            datos: "",
            descripcion: "Error interno del servidor"
        });

    }

};
//SP READ BY ID
export const getUsuarioById = async (request, result) => {

    try {

        const { id } = request.params;

        // Validación
        if (!id || isNaN(id)) {

            return result.status(400).json({
                resultado_tipo: "warning",
                respuesta_detalle: "El ID debe ser numérico",
                datos: "",
                descripcion: "Validación de parámetros"
            });

        }

        const pool = await getConnection();

        const respuesta = await
            pool
                .request()
                .input("ID_Usuario", sql.Int, id)
                .execute("SP_LeerUsuariosPorID");

        const descripcion = "Endpoint que permite consultar usuarios por ID";

        const resultadoCompleto = {
            resultado_tipo: respuesta.recordsets[1][0].msj_tipo,
            respuesta_detalle: respuesta.recordsets[1][0].msj_texto,
            datos: respuesta.recordsets[0] || [],
            descripcion: descripcion
        };

        return result.json(resultadoCompleto);

    }
    catch (error) {

        console.log(request.params);
        console.log(error);

        return result.status(500).json({
            resultado_tipo: "error",
            respuesta_detalle: error.message,
            datos: "",
            descripcion: "Error interno del servidor"
        });

    }

};

//SP Actualizar

export const updateUsuario = async (request, result) => {

    try {

        const { ID_Usuario, Nombre_Usuario, Credencial_Espacial, ID_Perfil } = request.body;

        // Validaciones
        if (
            !ID_Usuario ||
            !Nombre_Usuario ||
            !Credencial_Espacial ||
            !ID_Perfil
        ) {

            return result.status(400).json({
                resultado_tipo: "warning",
                respuesta_detalle: "Todos los campos son obligatorios",
                datos: "",
                descripcion: "Validación de datos"
            });

        }

        // Validar IDs numéricos
        if (isNaN(ID_Usuario) || isNaN(ID_Perfil)) {

            return result.status(400).json({
                resultado_tipo: "warning",
                respuesta_detalle: "ID_Usuario e ID_Perfil deben ser numéricos",
                datos: "",
                descripcion: "Validación de tipos de datos"
            });

        }

        const pool = await getConnection();

        const respuesta = await
            pool
                .request()
                .input("ID_Usuario", sql.Int, ID_Usuario)
                .input("Nombre_Usuario", sql.NVarChar, Nombre_Usuario)
                .input("Credencial_Espacial", sql.NVarChar, Credencial_Espacial)
                .input("ID_Perfil", sql.Int, ID_Perfil)
                .execute("SP_ActualizarUsuarios");

        const descripcion = "Endpoint que permite actualizar usuarios";

        const resultadoCompleto = {
            resultado_tipo: respuesta.recordsets[0][0].msj_tipo,
            respuesta_detalle: respuesta.recordsets[0][0].msj_texto,
            datos: "",
            descripcion: descripcion
        };

        return result.json(resultadoCompleto);

    }
    catch (error) {

        console.log(request.body);
        console.log(error);

        return result.status(500).json({
            resultado_tipo: "error",
            respuesta_detalle: error.message,
            datos: "",
            descripcion: "Error interno del servidor"
        });

    }

};
//SP Delete logico

export const deleteLogico = async (request, result) => {

    try {

        const { id } = request.params;

        // Validación
        if (!id || isNaN(id)) {

            return result.status(400).json({
                resultado_tipo: "warning",
                respuesta_detalle: "El ID es inválido",
                datos: "",
                descripcion: "Validación de parámetros"
            });

        }

        const pool = await getConnection();

        const respuesta = await
            pool
                .request()
                .input("ID_Usuario", sql.Int, parseInt(id))
                .execute("SP_EliminarUsuario");

        const descripcion = "Endpoint que permite eliminar lógicamente un usuario";

        const resultadoCompleto = {
            resultado_tipo: respuesta.recordsets[0][0].msj_tipo,
            respuesta_detalle: respuesta.recordsets[0][0].msj_texto,
            datos: "",
            descripcion: descripcion
        };

        return result.json(resultadoCompleto);

    }
    catch (error) {

        console.log(request.params);
        console.log(error);

        return result.status(500).json({
            resultado_tipo: "error",
            respuesta_detalle: error.message,
            datos: "",
            descripcion: "Error interno del servidor"
        });

    }

};

//SP Delete Fisico

export const deleteFisico = async (request, result) => {

    try {

        const { id } = request.params;

        // Validación
        if (!id || isNaN(id)) {

            return result.status(400).json({
                resultado_tipo: "warning",
                respuesta_detalle: "El ID es inválido",
                datos: "",
                descripcion: "Validación de parámetros"
            });

        }

        const pool = await getConnection();

        const respuesta = await
            pool
                .request()
                .input("ID_Usuario", sql.Int, parseInt(id))
                .execute("SP_EliminarUsuarioFisico");

        const descripcion = "Endpoint que permite eliminar físicamente un usuario";

        const resultadoCompleto = {
            resultado_tipo: respuesta.recordsets[0][0].msj_tipo,
            respuesta_detalle: respuesta.recordsets[0][0].msj_texto,
            datos: "",
            descripcion: descripcion
        };

        return result.json(resultadoCompleto);

    }
    catch (error) {

        console.log(request.params);
        console.log(error);

        return result.status(500).json({
            resultado_tipo: "error",
            respuesta_detalle: error.message,
            datos: "",
            descripcion: "Error interno del servidor"
        });

    }

};