const express = require('express');
const router = express.Router();

const passport = require('passport');
const {isLoggedIn, isnoLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');

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
    successRedirect: '/autos',
    failureRedirect: '/registro',
    failureFlash: true
}))

router.get('/acceso', isnoLoggedIn, (req,res) => {
    res.render('auth/acceso')
})

router.post('/acceso', isnoLoggedIn, (req, res, next) => {
    passport.authenticate('local.acceso', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user){
            return res.redirect('/acceso')
        }
        req.logIn(user, (err) => {
            if(err){
                return next(err);
            }

            if (user.ID_USER === 1){
                return res.redirect('/admin')
            } else {
                return res.redirect('/autos')
            }
        })
    })(req,res,next);
});

router.get('/perfil', isLoggedIn, (req,res) => {
    res.render('auth/perfil');
});

router.get('/editarUser/:ID_USER', isLoggedIn, async (req,res) => {
    const {ID_USER} = req.params;
    const editarUser = await pool.query('SELECT * FROM usuario WHERE ID_USER = ?', [ID_USER]);
    res.render('auth/editarUser', {editarUser: editarUser[0]});
});


router.post('/editarUser/:ID_USER', isLoggedIn, async (req,res) => {
    const { ID_USER } = req.params;
    const { user_correo, user_telefono, user_contrasenia } = req.body;
    const editarUser = {
        user_correo,
        user_telefono,
        user_contrasenia: await helpers.encryptContrasenia(user_contrasenia)
    };
    await pool.query('UPDATE usuario set ? WHERE ID_USER = ?', [editarUser, ID_USER]);
    req.flash('auto_success', 'Usuario actualizado con éxito');
    res.redirect('/perfil');
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