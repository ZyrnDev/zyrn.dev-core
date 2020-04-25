const express   = require('express');
const router    = express.Router();

router.get('/', function (req, res) {
    res.send('<form action="http://localhost:9000/api/realm/accounts/add" method="POST"><div><label>Email</label><input type="text" name="guid"></div><div><label>Password</label><input type="text" name="password"></div><input type="submit" class="my-button" value="Add"></form>');
    // res.send('<div id="account"> <form action="http://localhost:9000/api/realm/accounts/update" method="POST"> <label>ID:</label>29<br> <input type="hidden" name="id" value=29> <label>Email:</label><input type="text" name="guid" value="email"/><br> <label>Password:</label><input type="text" name="password" value=""/><br> <input type="submit" class="my-button" value="Submit"> </form> <form action="http://localhost:9000/api/realm/accounts/delete/29" method="POST"> <input type="hidden" name="id" value=29> <input type="submit" class="my-button" value="Delete"> </form> </div>');
});

//Routes
router.use('/test', require("./test/core.js"));
router.use('/api', require("./api/core.js"));
router.use('/files?', require("./file/core.js"));
router.use('/realm', require("./realm/core.js"));

module.exports = router;

