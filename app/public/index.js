//Create Account 1
async function showContainer3() {
    event.preventDefault();
    const formData = getData('signupform1');

    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };

    try {
        const responce = await fetch('/CreAccount1', option);
        const Rdata = await responce.json();
        console.log(Rdata);

        printmessage(Rdata);

        if (Rdata.status == "success") {
            demoshowContainer3();
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//Create Account 2
async function Signupform() {
    event.preventDefault();
    const formData = getData('signupform2');

    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };

    try {
        const responce = await fetch('/CreAccount2', option);
        const Rdata = await responce.json();
        console.log(Rdata);

        printmessage(Rdata);

        if (Rdata.status === "success") {
            // alert("Successfully Created Account!");
            window.location.href = "/main"
        }
                
    } catch (error) {
        console.error('Fetch error:', error);
    }
}



//Login
async function Loginform() {
    event.preventDefault();
    const formData = getData('Loginform');

    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };

    try {
        const responce = await fetch('/LoginAccount', option);
        const Rdata = await responce.json();
        console.log(Rdata);

        printmessage(Rdata);

        if (Rdata.status === "success") {
            // alert("Successfully Logged in!");
            window.location.href = "/main";
        }
                
    } catch (error) {
        console.error('Fetch error:', error);
    }
}