const express = require('express');
const router = express.Router();

// REDERIZAR EL FORMULRIO
router.get('/registro', (req, res) => {
    res.render('auth/registro')
});

// RECIBE LOS DATOS DEL FORMULARIO
router.post('/registro', (req, res) => {
    console.log(req.body)
    res.send('resivido')
});

module.exports = router;