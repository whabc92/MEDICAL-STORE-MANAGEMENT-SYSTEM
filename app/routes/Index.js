const express = require('express');
const path = require('path');
const router = express.Router();
const extra = require('./validation.js');
const db = require('./database.js');



//password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;



//Home Page
router.get('/', (req, res) => {
    if (req.session.main) {
        return res.redirect('/main');
    }
    res.sendFile(path.join(__dirname, '../views/index.html'));
});



//Create Account 1
router.post('/CreAccount1', async (req, res) => {
    console.log('i got a CreAccount1 request');
    console.log(req.body);
    const data = req.body;

    req.session.form1Data = null;
    
    //check validation
    const result = await extra.checkValidCreAccount1(data);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //check mobile no
    if (await db.checkMobileExists(data.mobile)) {
        return res.status(401).json({
            status: "failed",
            message: "Mobile No Already Exists"
        });
    }

    //copy values
    const { firstname, lastname, dob, gender, mobile, address } = req.body;
    req.session.form1Data = { firstname, lastname, dob, gender, mobile, address };

    return res.status(200).json(result);
});



//Create Account 2
router.post('/CreAccount2', async (req, res) => {
    //redirect
    const form1Data = req.session.form1Data;
    if (!form1Data) return res.json({ status: "failed", message: "Complete Page 1 first" });

    console.log('i got a CreAccount2 request');
    console.log(req.body);
    const data = req.body;

    //check validation
    const result = await extra.checkValidCreAccount2(data);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //check username
    if (await db.checkUsernameExists(data.username)) {
        return res.status(401).json({
            status: "failed",
            message: "Username Already Exists"
        });
    }

    //save information
    const responce = await db.registerUser(form1Data, data.username, data.password1);

    if(responce.status === "success"){
        req.session.main = true;
        req.session.U_id = responce.userId;
        
        return res.status(200).json(responce);
    }
        
    return res.status(401).json(responce);
    
});




//Login Account
router.post('/LoginAccount', async (req, res) => {
    console.log('i got a LoginAccount request');
    console.log(req.body);
    const data = req.body;

    //check validation
    const result = await extra.checkValidLogin(data);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //check username
    const user = await db.checkUsernameExists(data.username);
    if (!user) {
        return res.status(401).json({
            status: "failed",
            message: "Username Not Exists"
        });
    }

    const passwordMatch = await bcrypt.compare(data.password, user.U_Password);
    if (!passwordMatch) {
        return res.status(401).json({
            status: "failed", 
            message: "Incorrect password"
        });
    }

    req.session.main = true;
    req.session.U_id = user.U_id;
    return res.status(200).json({
        status: "success", 
        message: "Successfully Logged In!",
        U_id: user.U_id
    });    
});



//export
module.exports = {
    router,
};
