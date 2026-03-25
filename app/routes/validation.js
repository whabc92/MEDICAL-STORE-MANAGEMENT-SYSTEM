function showTimeStamp() {
    const currentDate = new Date();
    const CurrDate = currentDate.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    const CurrTime = currentDate.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
    let [day, month, year] = CurrDate.split('/');
    month  = month < 10 ? 0 + month : month;
    day = day < 10 ? 0 + day : day;
    const formattedDate = `${year}-${month}-${day}`;
    return {
        date : formattedDate,
        time : CurrTime,
        year : year,
        month : month,
        day : day,
    };
}



const regeX = /^[a-zA-Z0-9@]{5,}$/;
const regeName = /^[a-zA-Z]{3,}$/;
const regeAddress = /^[a-zA-Z0-9\s,.-]{5,}$/;
const regeDob = /^\d{4}-\d{2}-\d{2}$/;
const regeMob = /^\d{10}$/;

const regeMName = /^[a-zA-Z0-9\s]{3,}$/;
const regeMQuantity = /^[1-9]\d*$/;
const regeMPrice = /^\d+(\.\d{1,2})?$/;
const regeAge = /^\d{1,2}$/;



// Create Account 1
function checkValidCreAccount1(data) {

    if (!regeName.test(data.firstname)) {
        return {
            status: "failed",
            message: "Invalid Firstname"
        };
    }
    if (!regeName.test(data.lastname)) {
        return {
            status: "failed",
            message: "Invalid Lastname"
        };
    }
    if (!(regeDob.test(data.dob)) || !(new Date(data.dob) <= new Date(`${showTimeStamp().year-18}-${showTimeStamp().month}-${showTimeStamp().day}`))) {
        return {
            status: "failed",
            message: "You must be 18 or older to log in"
        };
    }
    if(!(regeName.test(data.gender))){
        return {
            status: "failed",
            message: "Invalid Gender"
        };
    }
    if (!(regeMob.test(data.mobile))) {
        return {
            status: "failed",
            message: "Invalid Mobile Number"
        };
    }
    if (!(regeAddress.test(data.address))) {
        return {
            status: "failed",
            message: "Invalid Address"
        };
    }

    return { 
        status: "success",
        message: "valid Information"
    };
}



//Create Account 2
function checkValidCreAccount2(data) {

    if (!(regeX.test(data.username))) {
        return {
            status: "failed",
            message: "Invalid Username"
        };
    }

    if (!(regeX.test(data.password1)) || !(regeX.test(data.password2)) || data.password1.trim() !== data.password2.trim()) {
        return {
            status: "failed",
            message: "Invalid Password or Not Same"
        };
    }

    return { 
        status: "success",
        message: "Valid Information"
    };
}



//Login Page
function checkValidLogin(data) {
    if (regeX.test(data.username) && regeX.test(data.password)) {
        return { 
            status: "success",
            message: "valid Login Page"
        };
    }
    
    return { 
        status: "failed",
        message: "Invalid Username & Password"
    };
}



//Add Medicine
function checkValidAddMed(data) {

    if (!regeMName.test(data.medName)) {
        return {
            status: "failed",
            message: "Invalid medName"
        };
    }
    if (!regeMQuantity.test(data.medQuantity)) {
        return {
            status: "failed",
            message: "Invalid medQuantity"
        };
    }
    if (!regeMPrice.test(data.medPrice)) {
        return {
            status: "failed",
            message: "Invalid medPrice"
        };
    }

    return { 
        status: "success",
        message: "valid Information"
    };

}



//Medicine Exists
function checkValidMedExists(data) {

    if (!regeMName.test(data.medName)) {
        return {
            status: "failed",
            message: "Invalid medName"
        };
    }
    if (!regeMQuantity.test(data.medQuantity)) {
        return {
            status: "failed",
            message: "Invalid medQuantity"
        };
    }
    
    return { 
        status: "success",
        message: "valid Information"
    };

}



//Add Customer
function checkValidAddCus(data) {
    if (!regeName.test(data.firstname)) {
        return {
            status: "failed",
            message: "Invalid Firstname"
        };
    }
    if (!regeName.test(data.lastname)) {
        return {
            status: "failed",
            message: "Invalid Lastname"
        };
    }
    if (!regeName.test(data.gender)) {
        return {
            status: "failed",
            message: "Invalid Gender"
        };
    }
    if (!regeAge.test(data.age)) {
        return {
            status: "failed",
            message: "Invalid Age"
        };
    }
    if (!(regeMob.test(data.mobile))) {
        return {
            status: "failed",
            message: "Invalid Mobile Number"
        };
    }

    return { 
        status: "success",
        message: "valid Information"
    };

}



//Valid Generate Bill Page 1
function checkValidGBillP1(mobile) {
    
    if (!(regeMob.test(mobile))) {
        return {
            status: "failed",
            message: "Invalid Mobile Number"
        };
    }

    return { 
        status: "success",
        message: "valid Information"
    };

}


module.exports = {
    checkValidCreAccount1,
    checkValidCreAccount2,
    checkValidLogin,

    checkValidAddMed,
    checkValidMedExists,

    checkValidAddCus,
    
    checkValidGBillP1
}