const express = require('express');
const path = require('path');
const router = express.Router();
const extra = require('./validation.js');
const db = require('./database.js');

//Home Page
router.get('/', (req, res) => {
    if (!req.session.main) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../views/main.html'));
});



//show profile
router.get('/showProfileInfo', async (req, res) => {
    console.log('i got a showProfileInfo request');

    //get info from database
    const responce = await db.showProfileInfo(req.session.U_id);
    
    if(responce.status === "success"){
        return res.status(200).json(responce);
    }

    return res.status(401).json(responce);
});



//Profile edit Form1
router.post('/showProfileInfo/EditForm1', async (req, res) => {
    console.log('i got a EditForm1 request');
    console.log(req.body);
    const data = req.body;

    req.session.EditForm1 = null;

    //check validation
    const result = await extra.checkValidCreAccount1(data);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //check mobile no
    if (await db.EcheckMobileExists(data.mobile, req.session.U_id)) {
        return res.status(401).json({
            status: "failed",
            message: "Mobile No Already Exists"
        });
    }

    //copy values
    const { firstname, lastname, dob, gender, mobile, address } = req.body;
    req.session.EditForm1 = { firstname, lastname, dob, gender, mobile, address };

    return res.status(200).json(result);
});



//Profile edit form2
router.post('/showProfileInfo/EditForm2', async (req, res) => {
    //redirect
    const EditForm1 = req.session.EditForm1;
    if (!EditForm1) return res.json({ status: "failed", message: "Complete Page 1 first" });

    console.log('i got a EditForm2 request');
    console.log(req.body);
    const data = req.body;

    //check validation
    const result = await extra.checkValidCreAccount2(data);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //check username
    if (await db.EcheckUsernameExists(data.username, req.session.U_id)) {
        return res.status(401).json({
            status: "failed",
            message: "Username Already Exists"
        });
    }

    //save information
    const responce = await db.EditUser(EditForm1, data.username, data.password1, req.session.U_id);

    if(responce.status === "success"){
        return res.status(200).json(responce);
    }
        
    return res.status(401).json(responce);
});



//Print Inventary
router.get('/PrintIP', async (req, res) => {
    console.log('i got a PrintIP request');

    //get info from database
    const responce = await db.showPrintIP(req.session.U_id);

    if (responce.status === "success") {
        return res.status(200).json(responce);
    }

    return res.status(401).json(responce);
});



//Add Medicine
router.post('/AddMed', async (req, res) => {
    console.log('i got a AddMed request');
    console.log(req.body);
    const data = req.body;

    //check validation
    const result = await extra.checkValidAddMed(data);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //check medName
    if (await db.checkmedNameExists(data.medName, req.session.U_id)) {
        return res.status(401).json({
            status: "failed",
            message: "medName Already Exists"
        });
    }

    //save information
    const responce = await db.AddMed(data, req.session.U_id);

    if (responce.status === "success") {
        return res.status(200).json(responce);
    }

    return res.status(401).json(responce);

});



//Remove Medicine
router.delete('/RemMed/:medName/:medQuantity', async (req, res) => {
    console.log('i got a RemMed request');
    const data = {
        medName: req.params.medName,
        medQuantity: req.params.medQuantity
    }
    console.log(data);

    //check validation
    const result = await extra.checkValidMedExists(data);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //check medName
    const Valid = await db.checkmedNameExists(data.medName, req.session.U_id);
    console.log(Valid);
    if (!Valid) {
        return res.status(401).json({
            status: "failed",
            message: "medName Not Exists"
        });
    }

    //check quantity
    if (Valid.M_quantity < data.medQuantity) {
        return res.status(401).json({
            status: "failed",
            message: "Insufficent Quantity"
        });
    }

    //delete information
    const responce = await db.RemMed(data, Valid.M_id);

    if (responce.status === "success") {
        return res.status(200).json(responce);
    }

    return res.status(401).json(responce);
});



//Add Customer
router.post('/AddCus', async (req, res) => {
    console.log('i got a AddCus request');
    console.log(req.body);
    const data = req.body;

    //check validation
    const result = await extra.checkValidAddCus(data);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //check medName
    if (await db.checkmobileExists(data.mobile, req.session.U_id)) {
        return res.status(401).json({
            status: "failed",
            message: "mobileNo/Customer Already Exists"
        });
    }

    //save information
    const responce = await db.AddCus(data, req.session.U_id);

    if (responce.status === "success") {
        return res.status(200).json(responce);
    }

    return res.status(401).json(responce);

});



//Print Customer
router.get('/PrintCusP', async (req, res) => {
    console.log('i got a PrintCusP request');

    //get info from database
    const responce = await db.showPrintCusP(req.session.U_id);

    if (responce.status === "success") {
        return res.status(200).json(responce);
    }

    return res.status(401).json(responce);
});



//GBillP1
router.get('/GBillP1/:mobile', async (req, res) => {
    console.log('i got a GBillP1 request');
    req.session.GBillDatas = null;
    req.session.GBillDataIds = null;
    req.session.totalPrice = 0;

    const mobile = req.params.mobile;

    //validation
    const result = await extra.checkValidGBillP1(mobile);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //get info from database
    const responce = await db.checkmobileExists(mobile, req.session.U_id);
    if (!responce) {
        return res.status(401).json({
            status: "failed",
            message: "Customer Mobile Not Exists Add Customer First"
        });
    }

    req.session.C_id = responce.C_id;

    if (!req.session.GBillDatas) {
        req.session.GBillDatas = [];
    }
    if (!req.session.totalPrice) {
        req.session.totalPrice = 0;
    }
    if (!req.session.GBillDataIds) {
        req.session.GBillDataIds = [];
    }

    return res.status(200).json({
        status: "success",
        message: "Customer Mobile Exists"
    });

});



//GBillP2
router.post('/GBillP2', async (req, res) => {
    console.log('i got a GBillP2 request');
    console.log(req.body);
    const data = req.body;

    //check validation
    const result = await extra.checkValidMedExists(data);
    if (result.status !== "success") {
        return res.status(401).json(result);
    }

    //check medName
    const Valid = await db.checkmedNameExists(data.medName, req.session.U_id);
    if (!Valid) {
        return res.status(401).json({
            status: "failed",
            message: "medName Not Exists"
        });
    }

    //check quantity
    if (Valid.M_quantity < data.medQuantity) {
        return res.status(401).json({
            status: "failed",
            message: "Insufficent Quantity"
        });
    }

    //save information
    req.session.GBillDatas.push(data);
    req.session.GBillDataIds.push(Valid.M_id);
    req.session.totalPrice += data.medQuantity * Valid.M_price;

    return res.status(200).json({
        status: "success",
        message: "Medicine Added Successfully to GBill!",
        Meds: req.session.GBillDatas
    });

});



//GBillP
router.get('/GBill', async (req, res) => {
    console.log('i got a GBill request');

    //save info from database
    const responce = await db.AddGBill(req.session.GBillDatas, req.session.GBillDataIds, req.session.totalPrice, req.session.C_id, req.session.U_id);

    if (responce.status === "success") {
        return res.status(200).json(responce);
    }

    return res.status(401).json(responce);
});



//show sales history
router.get('/ShowSalesHis', async (req, res) => {
    console.log('i got a ShowSalesHis request');

    //get info from database
    const responce = await db.ShowSalesHis(req.session.U_id);

    if (responce.status === "success") {
        return res.status(200).json(responce);
    }

    return res.status(401).json(responce);
});



//show recipt
router.get('/ShowRecipt/:S_id', async (req, res) => {
    console.log('i got a ShowRecipt request');

    const S_id = req.params.S_id;

    //get info from database
    const responce = await db.ShowRecipt(S_id, req.session.U_id);

    if (responce.status === "success") {
        return res.status(200).json(responce);
    }

    return res.status(401).json(responce);
});



//LogOut
router.get('/LogOut', (req, res) => {
    console.log('i got a LogOut request');
    req.session.destroy();

    res.status(200).json({ 
        status: "success",
        message: "Logged out" 
    });
});




//export
module.exports = {
    router
};