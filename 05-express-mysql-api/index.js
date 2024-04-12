const express = require('express');
const cors = require('cors');
const { connectToDB, getConnection } = require('./sql');
const { getAllCustomers, addCustomer, deleteCustomer, updateCustomer } = require('./customerDataLayer');
const customerServices = require('./customerServiceLayers');
require('dotenv').config();

const app = express();

// RESTFUL API
app.use(cors()); // enable cross origin resources sharing
app.use(express.json()); // enable sending back responses as JSON
                         // and reciving data as JSON

async function main() {

    await connectToDB(
        process.env.DB_HOST,
        process.env.DB_USER,
        process.env.DB_DATABASE,
        process.env.DB_PASSWORD
    );

    const connection = getConnection();

    app.get('/api/customers', async function(req,res){
        const customers = await customerServices.getAllCustomers();
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
        const { first_name, last_name, rating, company_id, employees} = req.body;
        const results = await customerServices.addNewCustomer(first_name, last_name, rating, company_id, employees)
        
        if (results.success) {
            res.json({
                'new_customer_id': results.insertId
            })
        } else {
            res.json(400);
            res.json(results);
        }
      
   
    })

    app.delete('/api/customers/:customerId', async function(req,res){
        const {customerId} = req.params;
        const results = await deleteCustomer(customerId);
        if (results.success) {
            res.status(200);
            res.json(results);
        } else {
            res.status(400);
            res.json(results);
        }
    })

    app.put('/api/customers/:customerId', async function(req,res){
        const {customerId} = req.params;
       
        await updateCustomer(customerId, {...req.body});
        res.json({
            'message':"The user has been updated successfully"
        });
        
    })

}

main();



app.listen(3000, function(){
    console.log("server has started");
})