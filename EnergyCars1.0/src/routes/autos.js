const express = require('express');
const router = express.Router();

const pool =  require('../database');

router.get('/agregar', (req, res) => {
    res.render('autos/agregar');
});

router.post('/agregar', async (req, res) => {
    const { veh_marca, veh_modelo, veh_anio, veh_patente } = req.body;
    const newAutos = {
        veh_marca,
        veh_modelo,
        veh_anio,
        veh_patente
    };
    await pool.query('INSERT INTO vehiculos set ?', [newAutos]);
    console.log(newAutos);
    res.redirect('/autos');
});

// router.get('/', async (req, res) => {
//     const vehiculos = await pool.query('SELECT * FROM vehiculos');
//     res.render('autos/listar', { vehiculos });
// });

// router.get('/eliminar/:ID_VEH', async (req,res) => {
//     const {ID_VEH} = req.params;
//     await pool.query('DELETE FROM vehiculos WHERE ID_VEH = ?', [ID_VEH]);
//     res.redirect('/autos');
// });

// router.get('/editar/:ID_VEH', async (req,res) => {
//     const {ID_VEH} = req.params;
//     const editarAutos = await pool.query('SELECT * FROM vehiculos WHERE ID_VEH = ?', [ID_VEH]);
//     res.render('autos/editar', {editarAutos: editarAutos[0]});
// });


// router.post('/editar/ID_VEH', async (req,res) => {
//     const { ID_VEH } = req.params;
//     const { veh_marca, veh_modelo, veh_anio, veh_patente } = req.body;
//     const editarAutos = {
//         veh_marca,
//         veh_modelo,
//         veh_anio,
//         veh_patente
//     };
//     console.log(editarAutos);
//     await pool.query('UPDATE vehiculos set ? WHERE ID_VEH = ?', [editarAutos, ID_VEH]);
//     res.redirect('/autos');
// })

module.exports = router;