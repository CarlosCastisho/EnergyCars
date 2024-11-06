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

router.get('/editarAdminUser/:ID_USER', isLoggedIn, async (req,res) => {
    const {ID_USER} = req.params;
    const editarAdminUser = await pool.query('SELECT * FROM usuario WHERE ID_USER = ?', [ID_USER]);
    res.render('admin/editarAdminUser', {editarAdminUser: editarAdminUser[0]});
});


router.post('/editarAdminUser/:ID_USER', isLoggedIn, async (req,res) => {
    const { ID_USER } = req.params;
    const { user_correo, user_telefono } = req.body;
    const editarAdminUser = {
        user_correo,
        user_telefono
    };
    await pool.query('UPDATE usuario set ? WHERE ID_USER = ?', [editarAdminUser, ID_USER]);
    req.flash('auto_success', 'Usuario actualizado con éxito');
    res.redirect('/admin');
})

router.get('/reservas', isLoggedIn, async (req,res) => {
    res.render('admin/gestionReservas');
});
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
    const { marc_nombre } = req.body;
    const nueva_marc_nombre = {marc_nombre}
    await pool.query('INSERT INTO marcas set ?', [nueva_marc_nombre]);
    req.flash('auto_success', 'MARCA AGREGADA CORRECTAMENTE');
    res.redirect('/admin/gestionautos');

});

// Ruta para agregar nuevo modelo
router.post('/gestionautos/modelo', isLoggedIn, async (req, res) => {
    const { mod_nombre} = req.body;
    if (mod_nombre) {
        await pool.query('INSERT INTO modelos (mod_nombre) VALUES (?)', [mod_nombre]);
    }
    req.flash('auto_success', 'MODELO AGREGADO CORRECTAMENTE');
    res.redirect('/admin/gestionautos');
});

// Ruta para agregar nuevo año
router.post('/gestionautos/anio', isLoggedIn, async (req, res) => {
    const { n_anio } = req.body;
    if (n_anio) {
        await pool.query('INSERT INTO anio (anio) VALUES (?)', [n_anio]);
    }
    req.flash('auto_success', 'AÑO AGREGADO CORRECTAMENTE');
    res.redirect('/admin/gestionautos');
});

// Ruta para agregar nuevo tipo de conector
router.post('/gestionautos/conector', isLoggedIn, async (req, res) => {
    const { tc_nombre } = req.body;
    if (tc_nombre) {
        await pool.query('INSERT INTO tipos_conectores (tc_nombre) VALUES (?)', [tc_nombre]);
    }
    req.flash('auto_success', 'CONECTOR AGREGADO CORRECTAMENTE');
    res.redirect('/admin/gestionautos');
});

router.get('/vermarcas', isLoggedIn, async (req, res) => {
    const marcas = await pool.query('SELECT * FROM marcas');
    const modelos = await pool.query('SELECT * FROM modelos');
    const tipos_conectores = await pool.query('SELECT * FROM tipos_conectores');
    const marca_modelo = await pool.query(`
            SELECT 
                marca_modelo.ID_MARCA_MODELO, 
                marcas.MARC_NOMBRE, 
                modelos.MOD_NOMBRE,
                tipos_conectores.TC_NOMBRE 
                FROM marca_modelo 
                JOIN marcas ON marca_modelo.ID_MARCA = marcas.ID_MARCA
                JOIN modelos ON marca_modelo.ID_MODELO = modelos.ID_MODELO
                JOIN tipos_conectores ON marca_modelo.ID_TC = tipos_conectores.ID_TC ;
            `);
    
    console.log({ marcas, modelos, tipos_conectores,marca_modelo });  // Debugging output

    res.render('admin/vermarcas', { marcas, modelos, tipos_conectores, marca_modelo });
});



//Ruta para agregar relación entre marca, modelo y tipo de conector
router.post('/vermarcas', isLoggedIn, async (req, res) => {
    const { id_marca, id_modelo, id_tc } = req.body;
    try {
        if (id_marca && id_modelo && id_tc) {
            await pool.query('INSERT INTO marca_modelo (ID_MARCA, ID_MODELO, ID_TC) VALUES (?, ?, ?)', [id_marca, id_modelo, id_tc]);
            req.flash('auto_success', 'Relación entre marca, modelo y tipo de conector agregada con éxito');
        }
        res.redirect('/admin/vermarcas');
    } catch (error) {
        console.error('Error al agregar relación marca-modelo-tipo de conector:', error);
        res.status(500).send('Error al agregar la relación marca-modelo-tipo de conector');
    }
});

// router.post('/eliminar/:ID_MARCA_MODELO', isLoggedIn, async (req, res) => {
//     const {ID_MARCA_MODELO} = req.params;
//     await pool.query('DELETE FROM marca_modelo WHERE ID_MARCA_MODELO = ?', [ID_MARCA_MODELO]);
//     req.flash('auto_success', 'RESGISTRO ELIMINADO')
//     res.redirect('/admin/vermarcas');


// } )
module.exports = router;