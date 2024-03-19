const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const { createConnection } = require('mysql2/promise');
require('dotenv').config();

const app = express();

// set up the view engine
app.set('view engine', 'hbs');

require('handlebars-helpers')({
    handlebars: hbs.handlebars
})

// enable static files
app.use(express.static('public'));

// enable form processing
app.use(express.urlencoded({
    extended: false
}))

// wax-on (template inheritance)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

async function main() {
    console.log(process.env);
    const connection = await createConnection({
        'host': process.env.DB_HOST, // server or the machine that hosts the database (IP address or web domain name)
        'user': process.env.DB_USER,
        'database': process.env.DB_DATABASE,
        'password':process.env.DB_PASSWORD
    })
    app.get('/customers', async function(req,res){
        // the [ ] is known as array destructuring
        let [customers] = await connection.execute(`
         SELECT Customers.*, Companies.name AS company_name FROM Customers JOIN
          Companies ON Customers.company_id = Companies.company_id
          ORDER BY first_name
        `);
        // is the same as:
        // let customers = await connection.execute("SELECT * FROM Customers")[0];
        res.render('customers',{
            'customers': customers
        })
    });

  
    app.get('/create-customers', async function(req,res){
        const [companies] = await connection.execute("SELECT * FROM Companies");
        const [employees] = await connection.execute("SELECT * FROM Employees");
        res.render('create-customers', {
           companies,
           employees
        });
    })

    app.post('/create-customers', async function(req,res){
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
        console.log(response);
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
        res.redirect('/customers');
   
    })

    app.get("/delete-customers/:customerId", async function(req,res){
        const { customerId} = req.params; // same as `const customerId = req.params.customerId`
        const query = `SELECT * FROM Customers WHERE customer_id = ?`;
        
        // connection.execute with a SELECT statement 
        // you always get an array as a result even if there ONLY one possible result
        const [customers] = await connection.execute(query, [customerId]);
        const customerToDelete = customers[0];

        res.render('delete-customer', {
            'customer': customerToDelete
        })

    })

    app.post('/delete-customers/:customerId', async function(req,res){
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
        res.redirect('/customers');
    })

    app.get('/update-customers/:customerId', async function(req,res){
        const { customerId} = req.params;
        
        const query = `SELECT * FROM Customers WHERE customer_id =?;`
        const [customers] = await connection.execute(query, [customerId]);
        const wantedCustomer = customers[0];
       
        const [companies] = await connection.execute("SELECT * FROM Companies");
        const [employees] = await connection.execute("SELECT * FROM Employees")
        
        // get all the employees that are currently serving the customer
        const [currentEmployees] = await connection.execute(`SELECT * FROM EmployeeCustomer 
                WHERE customer_id = ?`, [customerId]);

        console.log(currentEmployees);

        // const employeeIds = currentEmployees.map(function(e){
        //     return e.employee_id;
        // })

        const employeeIds = [];
        for (let e of currentEmployees) {
            employeeIds.push(e.employee_id)
        }


        res.render('update-customer',{
            'customer': wantedCustomer,
            companies,
            employees,
            employeeIds
        })
    })

    app.post('/update-customers/:customerId', async function(req,res){
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
        res.redirect('/customers');
        
    })

}

main();



app.listen(3000, function(){
    console.log("server has started");
})