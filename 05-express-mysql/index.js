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

        res.render('create-customers', {
            companies
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
        VALUES ("${first_name}", "${last_name}", ${rating}, ${company_id});`
        
        // get the query to test
        // res.send(query);

        const response = await connection.execute(query);

        res.redirect('/customers');
   
    })

    app.get("/delete-customers/:customerId", async function(req,res){
        const { customerId} = req.params; // same as `const customerId = req.params.customerId`
        const query = `SELECT * FROM Customers WHERE customer_id = ${customerId}`;
        
        // connection.execute with a SELECT statement 
        // you always get an array as a result even if there ONLY one possible result
        const [customers] = await connection.execute(query);
        const customerToDelete = customers[0];

        res.render('delete-customer', {
            'customer': customerToDelete
        })

    })

    app.post('/delete-customers/:customerId', async function(req,res){
        const {customerId} = req.params;

        // check if the customerId in a relationship with an employee
        const checkCustomerQuery = `SELECT * FROM EmployeeCustomer WHERE customer_id = ${customerId}`;
        const [involved] = await connection.execute(checkCustomerQuery);
        if (involved.length > 0) {
            res.send("Unable to delete because the customer is in a sales relationship of an employee");
            return;
        }

        const query = `DELETE FROM Customers WHERE customer_id = ${customerId}`;
        await connection.execute(query);
        res.redirect('/customers');
    })

    app.get('/update-customers/:customerId', async function(req,res){
        const { customerId} = req.params;
        const query = `SELECT * FROM Customers WHERE customer_id = ${customerId};`
        const [customers] = await connection.execute(query);
        const wantedCustomer = customers[0];
        const [companies] = await connection.execute("SELECT * FROM Companies");
        res.render('update-customer',{
            'customer': wantedCustomer,
            'companies': companies
        })
    })

    app.post('/update-customers/:customerId', async function(req,res){
        const {customerId} = req.params;
        const {first_name, last_name, rating, company_id} = req.body;
        const query = `UPDATE Customers SET first_name="${first_name}",
                        last_name="${last_name}", 
                        rating=${rating},
                        company_id=${company_id}
                       WHERE customer_id = ${customerId};`
    
        await connection.execute(query);
        res.redirect('/customers');
    })

}

main();



app.listen(3000, function(){
    console.log("server has started");
})