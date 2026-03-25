//Index Page Functions
function showContainer1() {
    document.querySelector(".s1").style.display = "block";
    document.querySelector(".s2").style.display = "none";
    document.querySelector(".s3").style.display = "none";
}

function showContainer2() {
    document.querySelector(".s1").style.display = "none";
    document.querySelector(".s2").style.display = "block";
    document.querySelector(".s3").style.display = "none";
}

function demoshowContainer3(){
    document.querySelector(".s1").style.display = "none";
    document.querySelector(".s2").style.display = "none";
    document.querySelector(".s3").style.display = "block";
}




//Main Page functions
function showPage(page) {
    const pages = ['HomeP', 'AddMedP', 'RemMedP', 'PrintIP','AddCusP','PrintCusP', 'GBillP', 'SalesHisP', 'ProfileP'];
    pages.forEach(p => document.querySelector(`.${p}`).style.display = 'none');
    document.querySelector(`.${page}`).style.display = 'block';

    if(page === 'ProfileP'){
        showProfileInfo();
    }
    if(page === 'PrintIP'){
        PrintIP();
    }
    if(page === 'PrintCusP'){
        PrintCusP();
    }
    if(page === 'SalesHisP'){
        ShowSalesHis();
    }
}



//function for the profile
function PrintProfile(){
    document.querySelector('.profile-container').style.display = "flex";
    document.querySelector('.ProfileEP').style.display = "none";
    showProfileInfo();
}

function EditProfile() {
    document.querySelector('.profile-container').style.display = "none";
    document.querySelector('.ProfileEP').style.display = "block";
    showsubContainer1();
}

function showsubContainer2(){
    document.querySelector(".sub-container1").style.display = "none";
    document.querySelector(".sub-container2").style.display = "block";
}

function showsubContainer1(){
    document.querySelector(".sub-container2").style.display = "none";
    document.querySelector(".sub-container1").style.display = "block";
}




//function for main data
function DGBillP2() {
    document.querySelector('.GBillP1').style.display = 'none';
    document.querySelector('.GBillP3').style.display = 'none';
    document.querySelector('.GBillP2').style.display = 'block';
}

function DGBillP1() {
    document.querySelector('.GBillP2').style.display = 'none';
    document.querySelector('.GBillP3').style.display = 'none';
    document.querySelector('.GBillP1').style.display = 'block';
}

function wrong() {
    const bodyReceipt = document.querySelector('.body-recipt');
    bodyReceipt.style.display = bodyReceipt.style.display === 'none' ? 'block' : 'none';
}




//Other Function
function getData(formId) {
    const form = document.getElementById(formId);
    const formElements = Array.from(form.elements);
    let obj = {};
    
    formElements.forEach(element => {
        if (element.name) {
            if (element.type === 'checkbox') {
                obj[element.name] = element.checked;
            } else if (element.type === 'radio') {
                if (element.checked) {
                    obj[element.name] = element.value;
                }
            } else {
                obj[element.name] = element.value;
            }
        }
    }); 
    return obj;
}



function getDataAndResetForm(formId) {
    const form = document.getElementById(formId);
    const formElements = Array.from(form.elements);
    let obj = {};

    formElements.forEach(element => {
        if (element.name) {
            // Store the current value before resetting
            if (element.type === 'checkbox') {
                obj[element.name] = element.checked;
                element.checked = false; // Reset checkbox
            } else if (element.type === 'radio') {
                if (element.checked) {
                    obj[element.name] = element.value;
                    element.checked = false; // Reset radio
                }
            } else {
                obj[element.name] = element.value;
                element.value = ''; // Reset input/select/textarea
            }
        }
    });
    return obj;
}



//print message
let message = document.querySelector(".message");

function printmessage(Rdata) {
    if (!message) return;

    message.innerHTML = Rdata.message;
    message.style.color = Rdata.status === "success" ? "green" : "red";
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}



//create table function
function generateTableHTML(data) {
    const keys = Object.keys(data[0]);

    let html = '<table>';
    html += '<thead><tr>';

    for (const key of keys) {
        html += `<th>${key}</th>`;
    }
    html += '</tr></thead>';
    html += '<tbody>';

    for (const row of data) {
        html += '<tr>';
        for (const key of keys) {
            html += `<td>${row[key]}</td>`;
        }
        html += '</tr>';
    }

    html += '</tbody>';
    html += '</table>';

    return html;
}



//Create table for Sales History
function generateTableHTMLForSalesHis (data) {
    const keys = Object.keys(data[0]);

    let html = '<table>';
    html += '<thead><tr>';

    for (const key of keys) {
        html += `<th>${key}</th>`;
    }
    html += `<th>View Recipt</th>`;
    html += '</tr></thead>';
    html += '<tbody>';

    for (const row of data) {
        html += '<tr>';
        for (const key of keys) {
            html += `<td>${row[key]}</td>`;
        }
        html += `<td><button class="Btn">View</button></td>`;
        html += '</tr>';
    }

    html += '</tbody>';
    html += '</table>';

    return html;
}



//add Serial No function
function addSerialNumbers(items) {
    return items.map((item, index) => ({
        serialNo: index + 1,
        ...item
    }));
}
