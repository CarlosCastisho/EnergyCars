const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth')

router.get('/', isLoggedIn, async (req, res) => {
    const adminuser = await pool.query('SELECT * FROM usuario WHERE ID_USER > 1 ');
    res.render('admin/gestionUser', { adminuser });
});

router.get('/eliminar/:ID_USER', isLoggedIn, async (req, res) => {
    const { ID_USER } = req.params;
    await pool.query('DELETE FROM usuario WHERE ID_USER = ?', [ID_USER]);
    req.flash('auto_success', 'USUARIO ELIMINADO')
    res.redirect('/admin');
});

router.get('/editar/:ID_VEH', isLoggedIn, async (req, res) => {
    const { ID_VEH } = req.params;
    const editarAutos = await pool.query('SELECT * FROM vehiculos WHERE ID_VEH = ?', [ID_VEH]);
    res.render('autos/editar', { editarAutos: editarAutos[0] });
});


router.post('/editar/:ID_VEH', isLoggedIn, async (req, res) => {
    const { ID_VEH } = req.params;
    const { veh_marca, veh_modelo, veh_anio, veh_patente } = req.body;
    const editarAutos = {
        veh_marca,
        veh_modelo,
        veh_anio,
        veh_patente
    };
    await pool.query('UPDATE vehiculos set ? WHERE ID_VEH = ?', [editarAutos, ID_VEH]);
    req.flash('auto_success', 'CAMBIO EXITOSO');
    res.redirect('/autos');
})

// router.get('/gestionautos', isLoggedIn, async (req,res) => {
//     res.redirect('/admin/gestionautos');
// });

router.get('/gestionautos', isLoggedIn, async (req, res) => {
    // Puedes pasar datos a la vista si lo necesitas, por ejemplo, lista de vehículos
    const vehiculos = await pool.query('SELECT * FROM vehiculos'); // Ejemplo opcional
    res.render('admin/gestionautos', { vehiculos });  // Renderiza la vista sin redirigir
});


// Ruta para agregar nueva marca
router.post('/gestionautos/marca', isLoggedIn, async (req, res) => {
    const { mar_nombre } = req.body;
    if (mar_nombre) {
        await pool.query('INSERT INTO marcas (mar_nombre) VALUES (?)', [mar_nombre]);
    }
    res.redirect('/admin/gestionautos');
});

// Ruta para agregar nuevo modelo
router.post('/gestionautos/modelo', isLoggedIn, async (req, res) => {
    const { mod_nombre } = req.body;
    if (mod_nombre) {
        await pool.query('INSERT INTO modelos (mod_nombre) VALUES (?)', [mod_nombre]);
    }
    res.redirect('/admin/gestionautos');
});

// Ruta para agregar nuevo año
router.post('/gestionautos/anio', isLoggedIn, async (req, res) => {
    const { n_anio } = req.body;
    if (n_anio) {
        await pool.query('INSERT INTO anio (n_anio) VALUES (?)', [n_anio]);
    }
    res.redirect('/admin/gestionautos');
});

// Ruta para agregar nuevo tipo de conector
router.post('/gestionautos/conector', isLoggedIn, async (req, res) => {
    const { tc_nombre } = req.body;
    if (tc_nombre) {
        await pool.query('INSERT INTO tipos_conectores (tc_nombre) VALUES (?)', [tc_nombre]);
    }
    res.redirect('/admin/gestionautos');
});

// router.get('/vermarcas', isLoggedIn, async(req, res) => {
//     res.render('admin/vermarcas')
// } )

//Ruta para obtener datos de marcas , modelos y tipos de conectores
router.get('/vermarcas', isLoggedIn, async (req, res) => {
    const marcas = await pool.query('SELECT * FROM marcas');
    const modelos = await pool.query('SELECT * FROM modelos');
    const tipos_conectores = await pool.query('SELECT * FROM tipos_conectores');

    console.log({ marcas, modelos, tipos_conectores });  // Debugging output

    res.render('admin/vermarcas', { marcas, modelos, tipos_conectores });
});

// Ruta para agregar relación entre marca, modelo y tipo de conector
router.post('/vermarcas/guardar', isLoggedIn, async (req, res) => {
    const { ID_MARCA, ID_MODELO, ID_TC } = req.body;
    try {
        if (ID_MARCA && ID_MODELO && ID_TC) {
            await pool.query('INSERT INTO marca_modelo (ID_MARCA, ID_MODELO, ID_TC) VALUES (?, ?, ?)', [ID_MARCA, ID_MODELO, ID_TC]);
            req.flash('success', 'Relación entre marca, modelo y tipo de conector agregada con éxito');
        }
        res.redirect('/admin/vermarcas');
    } catch (error) {
        console.error('Error al agregar relación marca-modelo-tipo de conector:', error);
        res.status(500).send('Error al agregar la relación marca-modelo-tipo de conector');
    }
});

router.get('/vermarcas', isLoggedIn, async (req, res) => {
    try {
        const resultados = await pool.query(`
            SELECT
                marca_modelo.ID_MARCA, 
                marcas.MAR_NOMBRE,
                marca_modelo.ID_MODELO,
                modelos.MOD_NOMBRE,
                marca_modelo.ID_TC,
                tipos_conectores.TC_NOMBRE
            FROM 
                marca_modelo
            JOIN 
                marcas ON marca_modelo.ID_MARCA = marcas.ID_MARCA
            JOIN 
                modelos ON marca_modelo.ID_MODELO = modelos.ID_MODELO
            JOIN 
                tipos_conectores ON marca_modelo.ID_TC = tipos_conectores.ID_TC;
        `);

        res.render('admin/vermarcas', { resultados });
    } catch (error) {
        console.error("Error al obtener los datos de la relación:", error);
        res.status(500).send("Error al cargar los datos de la relación.");
    }
});

//Ruta para obtener Estaciones de Carga
router.get('/gestionEstaciones', isLoggedIn, async (req, res) => {
    const estaciones_carga = await pool.query('SELECT * FROM estaciones_carga');
    const provincias = await pool.query('SELECT * FROM provincias');

    console.log({ estaciones_carga , provincias });  // Debugging output

    res.render('admin/gestionEstaciones', { estaciones_carga, provincias });
});

// Ruta para agregar Estaciones de carga
router.post('/gestionEstaciones', isLoggedIn, async (req, res) => {
    const {
        estc_nombre,
        estc_direccion,
        estc_localidad,
        estc_cant_surtidores,
        estc_latitud,
        estc_longitud
    } = req.body;

    let { id_provincia } = req.body; // `id_provincia` desde req.body, si está disponible

    try {
        // Si `id_provincia` depende de otra tabla, recupéralo aquí si no está en `req.body`
        if (!id_provincia) {
            const provinciaData = await pool.query('SELECT id_provincia FROM provincias');
            if (provinciaData.length > 0) {
                id_provincia = provinciaData[0].id_provincia;
            } else {
                throw new Error('ID_PROVINCIA no encontrado');
            }
        }

        // Verificar que todos los campos necesarios están presentes
        if (estc_nombre && estc_direccion && estc_localidad && estc_cant_surtidores && id_provincia && estc_latitud && estc_longitud) {
            await pool.query(
                'INSERT INTO estaciones_carga (estc_nombre, estc_direccion, estc_localidad, estc_cant_surtidores, id_provincia, estc_latitud, estc_longitud) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                [estc_nombre, estc_direccion, estc_localidad, estc_cant_surtidores, id_provincia, estc_latitud, estc_longitud]
            );
            req.flash('success', 'Estación de carga agregada con éxito');
        } else {
            console.log('Faltan algunos campos requeridos.');
        }
        res.redirect('/admin/gestionEstaciones');
    } catch (error) {
        console.error('Error al agregar estación de carga:', error);
        res.status(500).send('Error al agregar estación de carga');
    }
});

module.exports = router;