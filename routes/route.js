const express = require('express');
const router = express.Router();


const userController = require("../controllers/usercontroller")

const middleware = require("../middleware/commonmiddleware")



//login api
router.post("/login", userController.login)
//Create new Author
router.post('/createAuthors', userController.createUser);
//get blogs
router.get("/blogs", middleware.authentication, userController.getUSerlist)
    

module.exports = router;