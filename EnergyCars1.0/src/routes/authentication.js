const express = require('express');
const router = express.Router();

const passport = require('passport');

// REDERIZAR EL FORMULRIO
router.get('/registro', (req, res) => {
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

router.post('/registro', passport.authenticate('local.registro', {
    successRedirect: '/perfil',
    failureRedirect: '/registro',
    failureFlash: true
}))

router.get('/acceso', (req,res) => {
    res.render('auth/acceso')
})

router.post('/acceso', (req, res, next) => {
    passport.authenticate('local.acceso', {
        successRedirect: '/perfil',
        failureRedirect: '/acceso',
        failureFlash: true
    })(req,res,next);
})

router.get('/perfil', (req,res) => {
    res.render('perfil');
})

module.exports = router;