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


module.exports = router;