const express   = require('express');
const router    = express.Router();

// router.use('/accounts', require("./accounts.js"));
router.use('/refresh', require("./refresh.js"));

module.exports = router;
