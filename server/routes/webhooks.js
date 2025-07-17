const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log('📩 Webhook reçu :', req.body);
  res.status(200).send('Webhook OK');
});

module.exports = router;
