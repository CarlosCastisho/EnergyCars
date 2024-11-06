const express = require('express');
const router = express.Router();

const passport = require('passport');
const {isLoggedIn, isnoLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');
const {verificarReserva, hacerReserva } = require('../lib2/auth');

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

// PAGINA DE RESERVAS
router.get('/listarReserva', isLoggedIn, async (req, res) => {
    const reservas = await pool.query(`
        SELECT 
            reservas.ID_RESERVA,
            reservas.RESERVA_FECHA,
            reservas.RESERVA_HORA_INI,
            reservas.RESERVA_HORA_FIN,
            reservas.RESERVA_IMPORTE,
            estaciones_carga.ESTC_NOMBRE,
            estaciones_carga.ESTC_DIRECCION,
            estaciones_carga.ESTC_LOCALIDAD,
            estado_reservas.EST_RES_DESCRIP
        FROM 
            energycars.reservas
        JOIN 
            energycars.surtidores ON reservas.ID_SURTIDOR = surtidores.ID_SURTIDOR
        JOIN 
            energycars.estaciones_carga ON surtidores.ID_ESTC = estaciones_carga.ID_ESTC
        JOIN 
            energycars.estado_reservas ON reservas.ID_EST_RES = estado_reservas.ID_EST_RES
    `);
    res.render('auth/listarReserva', {reservas})
})

router.get('/reserva', isLoggedIn, async (req,res) => {
    const estacionCarga = await pool.query('SELECT * FROM estaciones_carga');
    const surtidor = await pool.query('SELECT * FROM surtidores');
    const tiempo_carga = await pool.query('SELECT * FROM tiempo_carga')
    res.render('auth/reserva', {estacionCarga, surtidor, tiempo_carga});
});

router.post('/reserva', isLoggedIn, async (req,res) => {
    const {ID_USER} = req.user;
    const {reserva_fecha, reserva_hora_ini, reserva_hora_fin, reserva_importe} = req.body;
    try {
        //Verificar si hay reserva disponible
        const reservaDisponible = await verificarReserva(reserva_fecha, reserva_hora_ini, reserva_hora_fin, ID_EST_RES, ID_SURTIDOR)
        console.log(reservaDisponible);
        if (reservaDisponible) {
            return res.status(409).json({ message: "Este horario ya esta reservado."})
        }

        //Si esta la reserva disponible la creamos.
        await hacerReserva(reserva_fecha, reserva_hora_ini, reserva_hora_fin, reserva_importe, ID_USER, ID_EST_RES, ID_SURTIDOR);
        res.redirect('/reserva');
    } catch(error) {

    }
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