const express = require('express');
const router = express.Router();

const passport = require('passport');
const {isLoggedIn, isnoLoggedIn } = require('../lib/auth');
const pool = require('../database');

// REDERIZAR EL FORMULRIO
router.get('/registro', isnoLoggedIn, (req, res) => {
    res.render('auth/registro')
});

// RECIBE LOS DATOS DEL FORMULARIO
// router.post('/registro', (req, res) => {
//     passport.isAuthenticated('local.registro', {
//         successRedirect: '/profile', //2:28:41
//         failureRedirect: '/registro',
//         failureFlash: true
//     })
//     res.send('resivido');
// });

router.post('/registro', isnoLoggedIn, passport.authenticate('local.registro', {
    successRedirect: '/perfil',
    failureRedirect: '/registro',
    failureFlash: true
}))

router.get('/acceso', isnoLoggedIn, (req,res) => {
    res.render('auth/acceso')
})

router.post('/acceso', isnoLoggedIn, (req, res, next) => {
    passport.authenticate('local.acceso', {
        successRedirect: '/perfil',
        failureRedirect: '/acceso',
        failureFlash: true
    })(req,res,next);
});

router.get('/perfil', isLoggedIn, (req,res) => {
    res.render('perfil');
});

router.get('/editarUser/:ID_USER', isLoggedIn, async (req, res) => {
    const {ID_USER} = req.params;
    const editarUser = await pool.query('SELECT * FROM usuario WHERE ID_USER = ?', [ID_USER]);
    console.log(ID_USER);
    console.log(editarUser);
    res.render('auth/editarUser', {editarUser: editarUser[0]});
})

router.get('/cerrar', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);  // Maneja el error si es necesario
        }
        res.redirect('/acceso');  // Redirecciona al usuario después del logout
    });
});

module.exports = router;