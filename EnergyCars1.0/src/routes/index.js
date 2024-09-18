const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('layouts/main');
});

module.exports = router;