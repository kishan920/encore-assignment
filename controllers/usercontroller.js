const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')

const createUser = async function (req, res) {

    try {
      const requestBody = req.body;
      const { fname , lname , title , email,password,usertype} = requestBody
      if(!(requestBody.usertype=="Admin"))
      {
        res.status(400).send({status: false, message:"only admin can open, Please contact your admin "});
        return
      }
      if (!validate.isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author details' })
        return
      }
  
      if (!validate.isValid(title)) {
        res.status(400).send({ status: false, message: 'Title is required' })
        return
      }
  
      if (!validate.isValidTitle(title)) {
        res.status(400).send({ status: false, message: `Title should be among Mr, Mrs, Miss` })
        return
      }
  
      if (!validate.isValid(fname)) {
        res.status(400).send({ status: false, message: `name is required` })
        return
      }
      if (typeof (fname) != 'string') {
        return res.status(400).send({ status: false, message: "Numbers are not allowed" })
      }
      if (!validate.isValid(lname)) {
        res.status(400).send({ status: false, message: `name is required` })
        return
      }
      if (typeof (lname) != 'string') {
        return res.status(400).send({ status: false, message: "Numbers are not allowed" })
      }
  
      if (!validate.isValid(email)) {
        res.status(400).send({ status: false, message: `Email is required` })
        return
      }
      if (!validate.validateEmail(email)) {
        res.status(400).send({ status: false, message: `Email should be a valid email address` })
        return
      }
      const isEmailAlreadyUsed = await userModel.findOne({ email }); 
  
      if (isEmailAlreadyUsed) {
        res.status(400).send({ status: false, message: `${email} email address is already registered` })
        return
      }
  
      if (!validate.isValid(password)) {
        res.status(400).send({ status: false, message: `Password is required` })
        return
      }
      if (!validate.validatePassword(password)) {
        res.status(400).send({ status: false, message: 'password should be between 8 and 15 characters' })
        return
      }
      
      const createUserData = await userModel.create(req.body)
      res.status(201).send({ status: true, msg: "successfully created", data: createUserData })
  
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message })
    }
  }

  const login = async function (req, res) {
    try {
      const requestBody = req.body;
      if (!validate.isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
        return
      }
  
      // Extract params
      const { email, password } = requestBody;
  
      // Validation starts
      if (!validate.isValid(email)) {
        res.status(400).send({ status: false, message: `Email is required` })
        return
      }
  
      if (!validate.validateEmail(email)) {
        res.status(400).send({ status: false, message: `Email should be a valid email address` })
        return
      }
  
      if (!validate.isValid(password)) {
        res.status(400).send({ status: false, message: `Password is required` })
        return
      }
      if (!validate.validatePassword(password)) {
        res.status(400).send({ status: false, message: 'password should be between 8 and 15 characters' })
        return
      }
      // Validation ends
  
      const user = await userModel.findOne({ email: email, password: password });
  
      if (!user) {
        res.status(401).send({ status: false, message: `Invalid login credentials` });
        return
      }
      const token = await jwt.sign({
        userId: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 1800
      }, 'soramoki')
  
      res.header('x-api-key', token);
      res.status(200).send({ status: true, message: `user login successfull`, data: { token } });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  }

  
 
const getUSerlist = async function (req, res) {
    try {
          if(req.body.usertype=="Admin" || req.body.usertype=="user")
          {
            res.status(404).send({ status: false, message: 'admin and user for only' })
            return
          }
        const filterQuery = { isDeleted: false }
        const user = await userModel.find(filterQuery).sort({ title: 1 }).select("fname laname email password usertype")
        if (Array.isArray(user) && user.length === 0) {
            res.status(404).send({ status: false, message: 'No user found' })
            return
        }

        res.status(200).send({ status: true, message: 'user list', data: user })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};
module.exports = {getUSerlist,login,createUser };