const express = require('express');
const router = express.Router();

const pool =  require('../database');
const {isLoggedIn} = require('../lib/auth')

router.get('/', isLoggedIn, async (req, res) => {
    const adminuser = await pool.query('SELECT * FROM usuario WHERE ID_USER > 1 ');
    res.render('admin/gestionUser', { adminuser });
});

router.get('/eliminar/:ID_USER', isLoggedIn, async (req,res) => {
    const {ID_USER} = req.params;
    await pool.query('DELETE FROM usuario WHERE ID_USER = ?', [ID_USER]);
    req.flash('auto_success', 'USUARIO ELIMINADO')
    res.redirect('/admin');
});

router.get('/editar/:ID_VEH', isLoggedIn, async (req,res) => {
    const {ID_VEH} = req.params;
    const editarAutos = await pool.query('SELECT * FROM vehiculos WHERE ID_VEH = ?', [ID_VEH]);
    res.render('autos/editar', {editarAutos: editarAutos[0]});
});


router.post('/editar/:ID_VEH', isLoggedIn, async (req,res) => {
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
    const { mod_nombre} = req.body;
    if (mod_nombre ) {
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
module.exports = router;