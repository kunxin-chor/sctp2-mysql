const data = require('./customerDataLayer');
const { getCustomerCountForEmployee } = require('./employeeDataLayer');

async function getAllCustomers() {
    const customers = await data.getAllCustomers();
    return customers;
}

async function addNewCustomer(first_name, last_name, rating, employees) {

    // make sure each of the employee is not serving 10 customers already because 10 is the max
    for (let employeeId of employees) {
        const customerCount = await getCustomerCountForEmployee(employeeId);
        if (customerCount == 10) {
            return {
                'success': false,
                'message':'One or more employee has reached maximum quota for customers'
            }
        }
    }


    const results = await data.addCustomer(first_name, last_name, rating, company_id, employees);
    return {
        'success': true,
        'insertId': results
    }

}

module.exports = { getAllCustomers, addNewCustomer};