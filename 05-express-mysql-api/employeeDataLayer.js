const { getConnection } = require("./sql");

async function getCustomerCountForEmployee(employee_id) {
    const connection = getConnection();
    const query = "SELECT COUNT(*) FROM EmployeeCustomer WHERE employee_id = ?";
    const [count] = connection.execute(query, [employee_id]);
    return count;

}

module.exports = { getCustomerCountForEmployee};