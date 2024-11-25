const express = require('express');
const router = express.Router();

const pool =  require('../database');
const {isLoggedIn, isnoLoggedIn} = require('../lib/auth')

router.get('/', isnoLoggedIn, async (req, res) => {
    res.render('negocio/sobreNosotros');
})