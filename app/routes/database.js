const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();



//for password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;



const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();



//Middleware to check if username exists & mobile no  exists
async function checkUsernameExists(username) {
    const [userRows] = await pool.execute('SELECT * FROM User WHERE Username = ? LIMIT 1', [username]);
    return userRows.length > 0 ? userRows[0] : null;
}
async function checkMobileExists(mobile) {
    const [mobileRows] = await pool.execute('SELECT U_mobile_no FROM UserTable WHERE U_mobile_no = ? LIMIT 1', [mobile]);
    return mobileRows.length > 0;
}



//for edit form
async function EcheckUsernameExists(username, U_id ) {
    const [userRows] = await pool.execute('SELECT Username FROM User WHERE Username = ? AND U_id != ?', [username, U_id]);
    return userRows.length > 0;
}
async function EcheckMobileExists(mobile, U_id ) {
    const [mobileRows] = await pool.execute('SELECT U_mobile_no FROM UserTable WHERE U_mobile_no = ? AND U_id != ?', [mobile, U_id]);
    return mobileRows.length > 0;
}



//Register User
async function registerUser(form1Data, username, password) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [maxIdResult] = await connection.execute(
            'SELECT MAX(U_id) AS max_id FROM UserTable'
        );
        const nextId = (maxIdResult[0].max_id || 0) + 1;

        await connection.execute(
            `INSERT INTO UserTable 
            (U_id, U_firstname, U_lastname, U_dob, U_gender, U_mobile_no, U_address) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nextId,
                form1Data.firstname,
                form1Data.lastname,
                form1Data.dob,
                form1Data.gender,
                form1Data.mobile,
                form1Data.address
            ]
        );

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            `INSERT INTO User (Username, U_Password, U_id) 
            VALUES (?, ?, ?)`,
            [username, hashedPassword, nextId]
        );

        await connection.commit();
        return { status: "success", message: "successfully created account", userId: nextId };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "Registration failed" };
    } finally {
        connection.release();
    }
}


//show Profile Information
async function showProfileInfo(U_id ) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [UserTableInfo] = await connection.execute('SELECT * FROM UserTable WHERE U_id = ? LIMIT 1', [U_id]);
        const [UserInfo] = await connection.execute('SELECT * FROM User WHERE U_id = ? LIMIT 1', [U_id]);

        const htmlContent = generateProfileHTML(UserTableInfo[0], UserInfo[0]);

        await connection.commit();
        return { status: "success", message: "successfully Showed Profile Info", Username: UserInfo[0].Username, UserTableInfo: UserTableInfo[0], htmlContent: `${htmlContent}` };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "show Profile Info failed" };
    } finally {
        connection.release();
    }
}



function generateProfileHTML(UserTableInfo, UserInfo) {
    const dob = new Date(UserTableInfo.U_dob);
    const formattedDob = `${dob.getDate().toString().padStart(2, '0')}-${(dob.getMonth() + 1).toString().padStart(2, '0')}-${dob.getFullYear()}`;

    return `<p><b>Username: </b>${UserInfo.Username}</p>
          <p><b>Firstname: </b>${UserTableInfo.U_firstname}</p>
          <p><b>Lastname: </b>${UserTableInfo.U_lastname}</p>
          <p><b>Date of Birth: </b>${formattedDob}</p>
          <p><b>Gender: </b>${UserTableInfo.U_gender}</p>
          <p><b>Mobile No: </b>+91 ${UserTableInfo.U_mobile_no}</p>
          <p><b>Address: </b>${UserTableInfo.U_address}</p>`;
}



//Edit User
async function EditUser(form1Data, username, password, U_id ) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.execute(
            `UPDATE UserTable 
             SET U_firstname = ?,
                 U_lastname = ?,
                 U_dob = ?,
                 U_gender = ?,
                 U_mobile_no = ?,
                 U_address = ?
             WHERE U_id = ?`,
            [
                form1Data.firstname,
                form1Data.lastname,
                form1Data.dob,
                form1Data.gender,
                form1Data.mobile,
                form1Data.address,
                U_id
            ]
        );

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            `UPDATE User 
                 SET Username = ?,
                     U_Password = ?
                 WHERE U_id = ?`,
            [username, hashedPassword, U_id]
        );

        await connection.commit();
        return { status: "success", message: "successfully Edit Profile Information" };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "Edit Profile failed" };
    } finally {
        connection.release();
    }
}



//Print Inventary
async function showPrintIP(U_id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [PrintIP] = await connection.execute(`
            SELECT 
              M_name, 
              M_quantity, 
              M_price 
            FROM Medicine
            WHERE U_id = ?
          `, [U_id]);

        await connection.commit();
        return { status: "success", message: "successfully Showed Inventary Info", Content: PrintIP };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "show Inventary Info failed" };
    } finally {
        connection.release();
    }
}




//Add Medicine 
async function checkmedNameExists(medName, U_id) {
    const [Rows] = await pool.execute('SELECT * FROM Medicine WHERE M_name = ? AND U_id = ? LIMIT 1', [medName, U_id]);
    return Rows.length > 0 ? Rows[0] : null;
}


async function AddMed(data, U_id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [maxIdResult] = await connection.execute(
            'SELECT MAX(M_id) AS max_id FROM Medicine'
        );
        const nextId = (maxIdResult[0].max_id || 0) + 1;

        await connection.execute(
            `INSERT INTO Medicine 
            (M_id, M_name, M_quantity, M_price, U_id) 
            VALUES (?, ?, ?, ?, ?)`,
            [
                nextId,
                data.medName,
                data.medQuantity,
                data.medPrice,
                U_id
            ]
        );

        await connection.commit();
        return { status: "success", message: "successfully Added Medicine" };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "Add Medicine Failed" };
    } finally {
        connection.release();
    }
}



//Remove Medicine
async function RemMed(data, M_id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.execute(
            'UPDATE Medicine SET M_quantity = M_quantity - ? WHERE M_id = ?',
            [data.medQuantity, M_id]
        );

        await connection.commit();
        return { status: "success", message: "successfully Remove Medicine Quantity" };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "Remove Medicine Quantity Failed" };
    } finally {
        connection.release();
    }
}



//Add customer
async function checkmobileExists(mobile, U_id) {
    const [Rows] = await pool.execute('SELECT * FROM Customers WHERE C_mobile_no = ? AND U_id = ? LIMIT 1', [mobile, U_id]);
    return Rows.length > 0 ? Rows[0] : null;
}



async function AddCus(data, U_id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [maxIdResult] = await connection.execute(
            'SELECT MAX(C_id) AS max_id FROM Customers FOR UPDATE'
        );
        const nextId = (maxIdResult[0].max_id || 0) + 1;

        await connection.execute(
            `INSERT INTO Customers 
            (C_id, C_firstname, C_lastname, C_gender, C_age, C_mobile_no, U_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nextId,
                data.firstname,
                data.lastname,
                data.gender,
                data.age,
                data.mobile,
                U_id
            ]
        );

        await connection.commit();
        return { status: "success", message: "Successfully added customer info" };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "Add Customer Info Failed" };
    } finally {
        connection.release();
    }
}



//print customer info
async function showPrintCusP(U_id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [PrintCusP] = await connection.execute(`
            SELECT 
              C_firstname, 
              C_lastname, 
              C_gender,
              C_age,
              C_mobile_no 
            FROM Customers
            WHERE U_id = ?
          `, [U_id]);

        await connection.commit();
        return { status: "success", message: "successfully Showed Customer Info", Content: PrintCusP };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "show Customer Info failed" };
    } finally {
        connection.release();
    }
}



//GBill
async function AddGBill(GBillDatas, GBillDataIds, totalPrice, C_id, U_id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [maxIdResult] = await connection.execute(
            'SELECT MAX(S_id) AS max_id FROM SalesTable FOR UPDATE'
        );
        const nextId = (maxIdResult[0].max_id || 0) + 1;

        const currentTime = new Date().toTimeString().split(' ')[0];
        const currentDate = new Date().toISOString().split('T')[0];

        await connection.execute(
            `INSERT INTO SalesTable 
            (S_id, S_date, S_time, S_total_price, C_id, U_id) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nextId, currentDate, currentTime, totalPrice, C_id, U_id]
        );

        const [maxIdResult1] = await connection.execute(
            'SELECT MAX(item_id) AS max_id FROM SalesItemsTable FOR UPDATE'
        );
        let nextId1 = (maxIdResult1[0].max_id || 0) + 1;

        const insertQuery = `
            INSERT INTO SalesItemsTable 
            (item_id, S_quantity, M_id, S_id, U_id) 
            VALUES (?, ?, ?, ?, ?)`;

        for (let i = 0; i < GBillDatas.length; i++) {
            await connection.execute(insertQuery, [
                nextId1++,
                GBillDatas[i].medQuantity,
                GBillDataIds[i],
                nextId,
                U_id
            ]);
        }

        const updateQuery = `UPDATE Medicine SET M_quantity = M_quantity - ? WHERE M_id = ?`;

        for (let i = 0; i < GBillDatas.length; i++) {
            const quantity = GBillDatas[i].medQuantity;
            const medicineId = GBillDataIds[i];
            await connection.execute(updateQuery, [quantity, medicineId]);
        }

        await connection.commit();
        return { status: "success", message: "Successfully Generated Bill", S_id: nextId };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "Failed to Generate Bill" };
    } finally {
        connection.release();
    }
}



//show sales history
async function ShowSalesHis(U_id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [ShowSalesHis] = await connection.execute(`
            SELECT 
                S_id,
                DATE_FORMAT(S_date, '%Y-%m-%d') AS Date,
                TIME_FORMAT(S_time, '%H:%i:%s') AS Time,
                S_total_price,
                c.C_mobile_no
            FROM 
                SalesTable st
            JOIN 
                Customers c ON st.C_id = c.C_id
            WHERE 
                st.U_id = ?
            ORDER BY 
                st.S_id DESC;
          `, [U_id]);

        await connection.commit();
        return { status: "success", message: "successfully Showed Sales History", Content: ShowSalesHis };

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "show Sales History failed" };
    } finally {
        connection.release();
    }
}



//show recipt
async function ShowRecipt(S_id, U_id) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [content1] = await connection.execute(`
            SELECT
                st.S_id,
                DATE_FORMAT(st.S_date, '%Y-%m-%d') AS Date,
                TIME_FORMAT(st.S_time, '%H:%i:%s') AS Time,
                st.S_total_price,
                -- Customer Details
                c.C_firstname,
                c.C_lastname,
                c.C_gender,
                c.C_age,
                c.C_mobile_no
            FROM
                SalesTable st
            JOIN
                Customers c ON st.C_id = c.C_id
            WHERE
                st.S_id = ? AND st.U_id = ?
          `, [S_id, U_id]);

        
        const [content2] = await connection.execute(`
            SELECT
                m.M_name,
                m.M_Price AS unit_price,
                si.S_quantity,
                (m.M_Price * si.S_quantity) AS total_price
            FROM
                SalesItemsTable si
            JOIN
                Medicine m ON si.M_id = m.M_id
            JOIN
                SalesTable st ON si.S_id = st.S_id
            WHERE
                si.S_id = ? AND st.U_id = ?
          `, [S_id, U_id]);

        await connection.commit();
        return { status: "success", message: "successfully Showed Recipt", Content1: content1[0], Content2: content2};

    } catch (error) {
        await connection.rollback();
        return { status: "error", message: "show Recipt failed" };
    } finally {
        connection.release();
    }
}





module.exports = {
    checkUsernameExists,
    checkMobileExists,
    EcheckUsernameExists,
    EcheckMobileExists,

    registerUser,
    showProfileInfo,
    EditUser,

    showPrintIP,
    checkmedNameExists,
    AddMed,
    RemMed,

    checkmobileExists,
    AddCus,
    showPrintCusP,
    
    AddGBill,
    ShowSalesHis,
    ShowRecipt
}