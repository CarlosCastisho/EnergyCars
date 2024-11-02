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

module.exports = router;