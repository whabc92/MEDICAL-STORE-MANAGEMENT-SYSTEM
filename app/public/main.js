//show Profile
async function showProfileInfo() {
    try {
        const responce = await fetch('/main/showProfileInfo');
        const Rdata = await responce.json();

        if (Rdata.status == "success") {
            document.querySelector(".profile-details").innerHTML = Rdata.htmlContent;
            fillForm(Rdata.Username, Rdata.UserTableInfo);
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



function fillForm(Username,UserTableInfo) {
    const dob = new Date(UserTableInfo.U_dob).toISOString().split('T')[0];
    document.getElementById('Cusername').value = Username;
    document.getElementById('firstname').value = UserTableInfo.U_firstname;
    document.getElementById('lastname').value = UserTableInfo.U_lastname;
    document.getElementById('dob').value = dob;
    document.getElementById('gender').value = UserTableInfo.U_gender;
    document.getElementById('mobile').value = UserTableInfo.U_mobile_no;
    document.getElementById('address').value = UserTableInfo.U_address;
}



//Profile Edit
async function EditForm() {
    event.preventDefault();
    const formData = getData('Editform1');

    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };

    try {
        const responce = await fetch('/main/showProfileInfo/EditForm1', option);
        const Rdata = await responce.json();

        printmessage(Rdata);

        if (Rdata.status == "success") {
            (showsubContainer2());
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//save Profile
async function SaveProfile() {
    event.preventDefault();
    const formData = getData('Editform2');

    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };

    try {
        const responce = await fetch('/main/showProfileInfo/EditForm2', option);
        const Rdata = await responce.json();

        printmessage(Rdata);

        if (Rdata.status === "success") {
            // alert("Successfully Saved information!");
            PrintProfile();
        }
                
    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//print inventary
async function PrintIP() {
    try {
        const responce = await fetch('/main/PrintIP');
        const Rdata = await responce.json();

        if (Rdata.status == "success") {
            Rdata.Content = addSerialNumbers(Rdata.Content);
            const htmlContent = generateTableHTML(Rdata.Content);
            document.querySelector(".PrintIP .table-div").innerHTML = htmlContent;
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//Add Inventary
async function AddMed() {
    event.preventDefault();
    const formData = getData('addMedicineForm');

    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };

    try {
        const responce = await fetch('/main/AddMed', option);
        const Rdata = await responce.json();

        printmessage(Rdata);

        if (Rdata.status === "success") {
            // alert("Medicinne Added Successfully!");

            getDataAndResetForm('addMedicineForm');
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//remove Inventary
async function RemMed() {
    event.preventDefault();
    const formData = getData('removeMedicineForm');

    const option = {
        method: "DELETE",
    }
    try {
        const responce = await fetch(`/main/RemMed/${formData.medName}/${formData.medQuantity}`, option);
        const Rdata = await responce.json();

        printmessage(Rdata);

        if (Rdata.status === "success") {
            // alert("Medicine Removed Successfully!");

            getDataAndResetForm('removeMedicineForm');
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//Add Customer
async function AddCus() {
    event.preventDefault();
    const formData = getData('customerDetailsForm');

    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };

    try {
        const responce = await fetch('/main/AddCus', option);
        const Rdata = await responce.json();

        printmessage(Rdata);

        if (Rdata.status === "success") {
            // alert("Customer Info Added Successfully!");

            getDataAndResetForm('customerDetailsForm');
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//print customer
async function PrintCusP() {
    try {
        const responce = await fetch('/main/PrintCusP');
        const Rdata = await responce.json();

        if (Rdata.status == "success") {
            Rdata.Content = addSerialNumbers(Rdata.Content);
            const htmlContent = generateTableHTML(Rdata.Content);
            document.querySelector(".PrintCusP .table-div").innerHTML = htmlContent;
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//GBillP1
async function GBillP1() {
    try {
        event.preventDefault();
        const formData = getData('GBillP1Form');

        const responce = await fetch(`/main/GBillP1/${formData.mobile}`);
        const Rdata = await responce.json();

        printmessage(Rdata);

        if (Rdata.status == "success") {
            getDataAndResetForm('GBillP1Form');

            DGBillP2();
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//GBillP2
async function GBillP2() {
    event.preventDefault();
    const formData = getData('GBillP2Form');

    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };

    try {
        const responce = await fetch('/main/GBillP2', option);
        const Rdata = await responce.json();

        printmessage(Rdata);

        if (Rdata.status === "success") {
            // alert("Medicine Added Successfully to GBill!");

            Rdata.Meds = addSerialNumbers(Rdata.Meds);
            const htmlContent = generateTableHTML(Rdata.Meds);
            document.querySelector(".GBillP3 .table-div").innerHTML = htmlContent;

            getDataAndResetForm('GBillP2Form');

            if (document.querySelector('.GBillP3').style.display === 'none') {
                document.querySelector('.GBillP3').style.display = 'block';
            }
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//GBill
async function GBill() {
    try {
        const responce = await fetch('/main/GBill');
        const Rdata = await responce.json();

        printmessage(Rdata);

        if (Rdata.status == "success") {
            DGBillP1();
            ShowRecipt(Rdata.S_id);
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//show sales History
async function ShowSalesHis() {
    try {
        const responce = await fetch('/main/ShowSalesHis');
        const Rdata = await responce.json();

        if (Rdata.status == "success") {
            const htmlContent = generateTableHTMLForSalesHis(Rdata.Content);
            document.querySelector(".SalesHisP .table-div").innerHTML = htmlContent;
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//show recipt
async function ShowRecipt(S_id) {
    try {
        const responce = await fetch(`/main/ShowRecipt/${S_id}`);
        const Rdata = await responce.json();
 
        printmessage(Rdata);

        if (Rdata.status == "success") {
            generateShowReciptHTML(Rdata.Content1, Rdata.Content2);
            wrong();
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}


function generateShowReciptHTML(Content1, Content2) {

    const htmlContent1 = `<h2>Receipt</h2>
            <p><b>Sales ID: </b>${Content1.S_id}</p>
            <p><b>Sales Date: </b>${Content1.Date}</p>
            <p><b>Sales Time: </b>${Content1.Time}</p>
            <p><b>Customer Firstname: </b>${Content1.C_firstname}</p>
            <p><b>Customer Lastname: </b>${Content1.C_lastname}</p>
            <p><b>Customer Age: </b>${Content1.C_age}</p>
            <p><b>Customer Gender: </b>${Content1.C_gender}</p>
            <p><b>Customer MobileNo: </b>${Content1.C_mobile_no}</p>`;

    document.querySelector(".recipt .recipt_info").innerHTML = htmlContent1;

    Content2 = addSerialNumbers(Content2);
    const htmlContent2 = generateTableHTML(Content2);
    document.querySelector(".recipt .table-div").innerHTML = htmlContent2;

    document.querySelector(".recipt .total-section").innerHTML = `<span><b>Total Amount: ${Content1.S_total_price}</b></span>`;
}




//show recipt for sales History
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.SalesHisP').addEventListener('click', function(e) {
      if (e.target.classList.contains('Btn')) {
        const S_id = e.target.closest('tr').querySelector('td').textContent.trim();
        if (window.ShowRecipt) ShowRecipt(S_id);
      }
    });
});



//LogOut
async function LogOut(){
    try {
        const responce = await fetch('/main/LogOut');
        const Rdata = await responce.json();

        if (Rdata.status == "success") {
            window.location.href = "/";
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}