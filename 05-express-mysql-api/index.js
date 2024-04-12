const express = require('express');
const { createConnection } = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

// RESTFUL API
app.use(cors()); // enable cross origin resources sharing
app.use(express.json()); // enable sending back responses as JSON
                         // and reciving data as JSON

async function main() {
    const connection = await createConnection({
        'host': process.env.DB_HOST, // server or the machine that hosts the database (IP address or web domain name)
        'user': process.env.DB_USER,
        'database': process.env.DB_DATABASE,
        'password':process.env.DB_PASSWORD
    })
    app.get('/api/customers', async function(req,res){
        // the [ ] is known as array destructuring
        let [customers] = await connection.execute(`
         SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN
          Companies ON Customers.company_id = Companies.company_id
          ORDER BY first_name
        `);
        // is the same as:
        // let customers = await connection.execute("SELECT * FROM Customers")[0];
        res.json({
            'customers': customers
        })
    });

    app.post('/api/customers', async function(req,res){
        // We can use object destructuring to quickly do the following:
        // const first_name = req.body.first_name;
        // const last_name = req.body.last_name;
        // const rating = req.body.rating;
        // const company_id = req.body.company_id;

        // Object Destructuring
        const { first_name, last_name, rating, company_id} = req.body;

        // Object Destructuring with Rename
        // const {first_name: firstName, last_name: lastName, rating, company_id: companyId} = req.body;
        
        // create the query
        const query = `INSERT INTO Customers (first_name, last_name, rating, company_id)
                            VALUES (?,?,?,?);`
        
        // get the query to test
        // res.send(query);

        const [response] = await connection.execute(query, [first_name, last_name, rating, company_id]);
        const insertId = response.insertId; // id of the newly created customer

        // ADD IN M:N relationship after the creating the row
        // We have to do so because the primary key is only available after the insert
        const { employees } = req.body; // same as `const employees = req.body.employees`
        
        let employeeArray = [];
        if (Array.isArray(employees)) {
            employeeArray = employees;
        } else {
            employeeArray.push(employees);
        }

        for (let employee_id of employeeArray) {
            await connection.execute(`INSERT INTO EmployeeCustomer (employee_id, customer_id) 
                                VALUES (?, ?)
            `, [employee_id, insertId])
        }
        res.json({
            'new_customer_id': insertId
        })
   
    })

    app.delete('/api/customers/:customerId', async function(req,res){
        const {customerId} = req.params;

        // check if the customerId in a relationship with an employee
        const checkCustomerQuery = `SELECT * FROM EmployeeCustomer WHERE customer_id = ?`;
        const [involved] = await connection.execute(checkCustomerQuery, [customerId]);
        if (involved.length > 0) {
            res.send("Unable to delete because the customer is in a sales relationship of an employee");
            return;
        }

        const query = `DELETE FROM Customers WHERE customer_id = ?`;
        await connection.execute(query, [customerId]);
        res.json({
            'message':"Customer has been deleted"
        })
    })

    app.put('/api/customers/:customerId', async function(req,res){
        const {customerId} = req.params;
        const {first_name, last_name, rating, company_id} = req.body;
        const query = `UPDATE Customers SET first_name=?,
                        last_name=?, 
                        rating=?,
                        company_id=?
                       WHERE customer_id = ?;`
    
        // update the customer first
        await connection.execute(query, [first_name, last_name, rating, company_id, customerId]);
        
        // 1. update the relationship by first DELETE all M:N relationships
        await connection.execute("DELETE FROM EmployeeCustomer WHERE customer_id = ?", [customerId]);

        // 2. add back the relationship that is selected by the user
        // ADD IN M:N relationship after the creating the row
        // We have to do so because the primary key is only available after the insert
        const { employees } = req.body; // same as `const employees = req.body.employees`
        
        let employeeArray = [];
        if (Array.isArray(employees)) {
            employeeArray = employees;
        } else {
            employeeArray.push(employees);
        }

        for (let employee_id of employeeArray) {
            await connection.execute(`INSERT INTO EmployeeCustomer (employee_id, customer_id) 
                                VALUES (?, ?)
            `, [employee_id, customerId])
        }
        res.json({
            'message':"The user has been updated successfully"
        });
        
    })

}

main();



app.listen(3000, function(){
    console.log("server has started");
})