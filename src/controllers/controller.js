import { getConnection, sql, } from "../models/connection.js";

export const getData = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT 1 AS test");
    res.json(result.recordset);
};

//SP CREATE


//SP READ
export const getUsuarios = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool.request()
            .execute("SP_LeerUsuarios");

        res.json({
            data: result.recordsets[0] || [],
            mensaje: result.recordsets[1]?.[0] || result.recordset[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//SP READ BY ID
export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({
                msj_tipo: "warning",
                msj_texto: "El ID debe ser un número válido"
            });
        }
        const pool = await getConnection();

        const result = await pool.request()
            .input("ID_Usuario", sql.Int, id)
            .execute("SP_LeerUsuariosPorID");

        // Si tu SP devuelve solo un resultset:
        res.json(result.recordset);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

//SP Actualizar

export const updateUsuario = async (req, res) => {
    try {
        const { ID_Usuario, Nombre_Usuario, Credencial_Espacial, ID_Perfil } = req.body;

        const pool = await getConnection();

        const result = await pool.request()
            .input("ID_Usuario", sql.Int, ID_Usuario)
            .input("Nombre_Usuario", sql.NVarChar, Nombre_Usuario)
            .input("Credencial_Espacial", sql.NVarChar, Credencial_Espacial)
            .input("ID_Perfil", sql.Int, ID_Perfil)
            .execute("SP_ActualizarUsuarios");

        res.json(result.recordset);

    }
    catch (error) {
        console.log(req.body);
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
