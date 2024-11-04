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

// // Ruta para agregar nuevas marcas , modelos , años y tipo de conectores
// router.post('/gestionautos', isLoggedIn, async (req, res) => {
//     const {mar_nombre} = req.body;
//     // insertar la marca en la base de datos
//     await pool.query('INSERT INTO marcas (mar_nombre) VALUES (?)', [mar_nombre]);
//     res.redirect('/admin/gestionautos');
// });

// router.post('/gestionautos', isLoggedIn, async (req, res) => {
//     const {mod_nombre} = req.body;
//     // insertar la marca en la base de datos
//     await pool.query('INSERT INTO modelos (mod_nombre) VALUES (?)', [mod_nombre]);
//     res.redirect('/admin/gestionautos');
// });

// router.post('/gestionautos', isLoggedIn, async (req, res) => {
//     const {mod_anio} = req.body;
//     // insertar la marca en la base de datos
//     await pool.query('INSERT INTO modelos (mod_anio) VALUES (?)', [mod_anio]);
//     res.redirect('/admin/gestionautos');
// });

// // Ruta para agregar o editar nuevas marcas, modelos y años
// router.post('/gestionautos', isLoggedIn, async (req, res) => {
//     const { mar_nombre, mod_nombre, mod_anio } = req.body;

//     try {
//         // Iniciar una transacción
//         await pool.query('START TRANSACTION');

//         // Insertar en la tabla `marcas` si `mar_nombre` está presente
//         let ID_MARCA;
//         if (mar_nombre) {
//             const result = await pool.query('INSERT INTO marcas (mar_nombre) VALUES (?)', [mar_nombre]);
//             ID_MARCA = result.insertId; // Obtener el ID de la marca recién insertada
//         }

//         // Insertar en la tabla `modelos` si `mod_nombre` y `mod_anio` están presentes
//         let ID_MODELO;
//         if (mod_nombre && mod_anio) {
//             await pool.query(
//                 'INSERT INTO modelos (mod_nombre, mod_anio) VALUES (?, ?)',
//                 [mod_nombre , mod_anio]
//             );
//             ID_MODELO = result.insertId;
//         }

//         // // Insertar en la tabla `tipos conectores` si `tc_nombre` está presente
//         // let ID_TC;
//         // if (tc_nombre) {
//         //     await pool.query(
//         //         'INSERT INTO tipos_conectores (tc_nombre) VALUES (?)',
//         //         [tc_nombre]
//         //     );
//         //     ID_TC = result.insertId;
//         // }        

//         // Confirmar la transacción
//         await pool.query('COMMIT');
//         res.redirect('/admin/gestionautos');
//     } catch (error) {
//         // Revertir la transacción en caso de error
//         await pool.query('ROLLBACK');
//         console.error('Error al insertar marca o modelo:', error);
//         res.status(500).send('Error al agregar la marca o el modelo');
//     }
// });

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

router.post('/vermarcas1', isLoggedIn, async(req, res) => {
    res.redirect('/admin/vermarcas')
} )

// Ruta para obtener datos de marcas , modelos y tipos de conectores
router.get('/vermarcas', isLoggedIn, async (req, res) => {
    const marcas = await pool.query('SELECT * FROM marcas');
    const modelos = await pool.query('SELECT * FROM modelos');
    const tipos_conectores = await pool.query('SELECT * FROM tipos_conectores');
    
    console.log({ marcas, modelos, tipos_conectores });  // Debugging output

    res.render('/admin/vermarcas', { marcas, modelos, tipos_conectores });
});

// Ruta para agregar relación entre marca, modelo y tipo de conector
// router.post('/vermarcas', isLoggedIn, async (req, res) => {
//     const { ID_MARCA, ID_MODELO, ID_TC } = req.body;
//     try {
//         if (ID_MARCA && ID_MODELO && ID_TC) {
//             await pool.query('INSERT INTO marca_modelo (ID_MARCA, ID_MODELO, ID_TC) VALUES (?, ?, ?)', [ID_MARCA, ID_MODELO, ID_TC]);
//             req.flash('success', 'Relación entre marca, modelo y tipo de conector agregada con éxito');
//         }
//         res.redirect('/admin/vermarcas');
//     } catch (error) {
//         console.error('Error al agregar relación marca-modelo-tipo de conector:', error);
//         res.status(500).send('Error al agregar la relación marca-modelo-tipo de conector');
//     }
// });
module.exports = router;