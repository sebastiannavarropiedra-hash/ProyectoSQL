CREATE DATABASE Proyecto1;
GO

USE Proyecto1;
GO

CREATE TABLE T_Planetas
(
    ID_Planeta INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nombre NVARCHAR(30) NOT NULL,
    Galaxia NVARCHAR(30) NOT NULL,
    Poblacion NVARCHAR(30) NOT NULL
);


CREATE TABLE T_Bibliotecarios
(
    ID_Bibliotecario INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nombre NVARCHAR(30) NOT NULL,
    Especie NVARCHAR(30) NOT NULL,
    Rango NVARCHAR(30) NOT NULL,
    ID_Planeta INT CONSTRAINT FK_Bibliotecarios_Planeta FOREIGN KEY (ID_Planeta) REFERENCES T_Planetas(ID_Planeta)
);


CREATE TABLE T_Libros_Estelares
(
    ID_Libro INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Titulo NVARCHAR(30) NOT NULL,
    Autor NVARCHAR(30) NOT NULL,
    Idioma_Universal NVARCHAR(30) NOT NULL
);


CREATE TABLE T_Perfiles_Seguridad
(
    ID_Perfil INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nivel_Acceso NVARCHAR(30) NOT NULL,
    Restricciones_Biometricas NVARCHAR(30) NOT NULL
);


CREATE TABLE T_Usuarios_Intergalacticos
(
    ID_Usuario INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nombre_Usuario NVARCHAR(30) NOT NULL,
    Credencial_Espacial NVARCHAR(30) NOT NULL,
    Estado BIT NOT NULL,
    ID_Perfil INT CONSTRAINT FK_Usuarios_Perfil FOREIGN KEY
    (ID_Perfil) REFERENCES T_Perfiles_Seguridad
    (ID_Perfil)
);


CREATE TABLE T_Ejemplares
(
    ID_Ejemplar INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ID_Libro INT CONSTRAINT FK_Ejemplares_Libro FOREIGN KEY (ID_Libro) REFERENCES T_Libros_Estelares(ID_Libro),
    Estado_Conservacion NVARCHAR(30) NOT NULL,
    Ubicacion_Pasillo NVARCHAR(30) NOT NULL
);


CREATE TABLE T_Prestamos
(
    ID_Prestamo INT IDENTITY(1,1) NOT NULL PRIMARY KEY,

    ID_Usuario INT
        CONSTRAINT FK_Prestamos_Usuario  
        FOREIGN KEY (ID_Usuario) 
        REFERENCES T_Usuarios_Intergalacticos(ID_Usuario),

    ID_Ejemplar INT
        CONSTRAINT FK_Prestamos_Ejemplar  
        FOREIGN KEY (ID_Ejemplar) 
        REFERENCES T_Ejemplares(ID_Ejemplar),

    Fecha_Estelar_Salida NVARCHAR(30) NOT NULL,
    Fecha_Estelar_Retorno NVARCHAR(30) NOT NULL
);

--- Insertar registros en tabla

INSERT  T_Usuarios_Intergalacticos
    (Nombre_Usuario, Credencial_Espacial, ID_Perfil, Estado)
VALUES
    ('John Doe', 'CREDENCIAL_ESPACIAL_1', 1, 1),
    ('Jane Smith', 'CREDENCIAL_ESPACIAL_2', 2, 1 ),
    ('Michael Johnson', 'CREDENCIAL_ESPACIAL_3', 3, 1),
    ('Emily Davis', 'CREDENCIAL_ESPACIAL_4', 2, 1),
    ('David Wilson', 'CREDENCIAL_ESPACIAL_5', 2, 1);

--Read simple 

SELECT *
FROM T_Usuarios_Intergalacticos

--READ con parametros

SELECT*
FROM T_Usuarios_Intergalacticos
WHERE ID_Usuario = 2

--UPDATE

UPDATE T_Usuarios_Intergalacticos 

SET 
Nombre_Usuario = 'Carlos Alvarado',
Credencial_Espacial = 'Pase Especial',
ID_Perfil = 3

WHERE ID_Usuario = 1;


--Delete Fisico

--DELETE FROM T_Usuarios_Intergalacticos WHERE ID_Usuario = 1


--Delete Logico

UPDATE T_Usuarios_Intergalacticos SET Estado = 0 WHERE ID_Usuario = 1

    go
---Crear vista simple


CREATE VIEW V_Usuarios_Activos
AS
    SELECT ID_Usuario, Nombre_Usuario, Credencial_Espacial
    FROM T_Usuarios_Intergalacticos
    WHERE Estado = 1;

      GO

--- CRUD Create Procedure 

CREATE or ALTER PROCEDURE SP_InsertarUsuario
    @Nombre_Usuario NVARCHAR(30),
    @Credencial_Espacial NVARCHAR(30),
    @ID_Perfil INT,
    @Estado BIT
AS
BEGIN
    SET NOCOUNT ON;
    --Inserta en la tabla usuarios
    BEGIN TRY

        IF 
        LEN(@Nombre_Usuario) = 0 OR
        LEN(@Credencial_Espacial) = 0 OR
        @ID_Perfil IS NULL

    BEGIN
        SELECT
            'warning' AS msj_tipo,
            'Debes ingresar todos los datos obligatorios.' AS msj_texto;
        RETURN;
    END
        ELSE
    BEGIN

        INSERT INTO T_Usuarios_Intergalacticos
            (Nombre_Usuario, Credencial_Espacial, ID_Perfil, Estado)
        VALUES
            (@Nombre_Usuario, @Credencial_Espacial, @ID_Perfil, @Estado);

        SELECT 'success' AS msj_tipo, 'Exito al realizar la acción.' AS msj_texto;

    END

    END TRY


     BEGIN CATCH

            SELECT ''
            SELECT 'error' AS msj_tipo, ERROR_MESSAGE() AS msj_texto;

     END CATCH

END;

    GO


--Ejecutar SP Crear

EXEC SP_InsertarUsuario
    'Carlos Alvarado',
    'Pase Especial',
    2,
    1;

    GO
---Crear SP Leer

CREATE OR ALTER PROCEDURE SP_LeerUsuarios
AS
BEGIN
SET NOCOUNT ON;
BEGIN TRY 

    BEGIN
            --verificacion
            IF EXISTS( SELECT 1
                FROM T_Usuarios_Intergalacticos
                WHERE Estado = 1
                )

        BEGIN
            SELECT ID_Usuario, Nombre_Usuario, Credencial_Espacial, ID_Perfil, Estado
            FROM T_Usuarios_Intergalacticos
            WHERE Estado = 1;
            SELECT 'success' AS msj_tipo, 'Exito al realizar la acción.' AS msj_texto;
        END

        ELSE

        BEGIN
            SELECT 'warning' AS msj_tipo, 'No se encontraron registros.' AS msj_texto;
        END
    END

END TRY
BEGIN CATCH
    SELECT 'error' AS msj_tipo, ERROR_MESSAGE() AS msj_texto;
END CATCH


END;

     GO



--Ejecutar SP Leer

EXEC SP_LeerUsuarios

    GO

    --crear sp por id

CREATE OR ALTER PROCEDURE SP_LeerUsuariosPorID
    @ID_Usuario INT
AS
BEGIN
SET NOCOUNT ON;
BEGIN TRY 

    BEGIN
            --verificacion
            IF @Id_Cliente <= 0
				BEGIN

					SELECT ''

					SELECT 'warning' AS msj_tipo, 'Debes ingresar un id valido.' AS msj_texto; 

				END

        BEGIN
            SELECT ID_Usuario, Nombre_Usuario, Credencial_Espacial, ID_Perfil, Estado
            FROM T_Usuarios_Intergalacticos
            WHERE ID_Usuario = @ID_Usuario;
            SELECT 'success' AS msj_tipo, 'Exito al realizar laacción.' AS msj_texto;
        END

        ELSE

        BEGIN
            SELECT 'warning' AS msj_tipo, 'No se encontraron registros.' AS msj_texto;
        END
    END

END TRY
BEGIN CATCH
    SELECT 'error' AS msj_tipo, ERROR_MESSAGE() AS msj_texto;
END CATCH


END;

     GO

     --Ejecutar SP Leer por ID

     EXEC SP_LeerUsuariosPorID 8

    GO

--- Crear SP Update

CREATE OR ALTER PROCEDURE SP_ActualizarUsuarios
    @ID_Usuario INT,
    @Nombre_Usuario NVARCHAR(30),
    @Credencial_Espacial NVARCHAR(30),
    @ID_Perfil INT
AS
BEGIN
SET NOCOUNT ON;
BEGIN TRY
    IF @ID_Usuario IS NULL OR @ID_Usuario <= 0 OR
            LEN(LTRIM(RTRIM(@Nombre_Usuario))) = 0 OR
            LEN(LTRIM(RTRIM(@Credencial_Espacial))) = 0 OR
            @ID_Perfil IS NULL OR @ID_Perfil <= 0
     BEGIN
        SELECT 'warning' AS msj_tipo, 'Debes ingresar todos los datos obligatorios.' AS msj_texto;
     END
    ELSE
    IF EXISTS (SELECT 1 FROM T_Usuarios_Intergalacticos WHERE ID_Usuario = @ID_Usuario)
    BEGIN
        UPDATE T_Usuarios_Intergalacticos
        SET Nombre_Usuario = @Nombre_Usuario,
            Credencial_Espacial = @Credencial_Espacial,
            ID_Perfil = @ID_Perfil
        WHERE ID_Usuario = @ID_Usuario;
        SELECT 'success' AS msj_tipo, 'Exito al realizar la acción.' AS msj_texto;
    END
    ELSE
    BEGIN
        SELECT 'warning' AS msj_tipo, 'No se encontraron registros.' AS msj_texto;
    END
END TRY
BEGIN CATCH
    SELECT 'error' AS msj_tipo, ERROR_MESSAGE() AS msj_texto;
END CATCH
END;
 

    GO
--Ejecutar SP Update

EXEC SP_ActualizarUsuarios
    @ID_Usuario = 8,
    @Nombre_Usuario = 'Test',
    @Credencial_Espacial = 'ABC123',
    @ID_Perfil = 1;


    GO
--- Crear SP Delete

CREATE PROCEDURE SP_EliminarUsuario
    @ID_Usuario INT
AS
BEGIN
    UPDATE T_Usuarios_Intergalacticos
    SET Estado = 0
    WHERE ID_Usuario = @ID_Usuario;
END;

--Ejecutar SP Delete

EXEC SP_EliminarUsuario
    1;

    GO

    