const express = require('express');
const router = express.Router();

// Exemple de route GET
router.get('/', (req, res) => {
  res.json({ message: 'Liste des utilisateurs' });
});

module.exports = router;
