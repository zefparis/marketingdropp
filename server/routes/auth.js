const express = require('express');
const router = express.Router();

// Exemple route
router.get('/', (req, res) => {
  res.send('Auth route ok');
});

module.exports = router;
