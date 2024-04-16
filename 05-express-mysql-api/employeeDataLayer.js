const { getConnection } = require("./sql");

async function getCustomerCountForEmployee(employee_id) {
    const connection = getConnection();
    console.log(connection);
    const query = "SELECT COUNT(*) AS employee_count FROM EmployeeCustomer WHERE employee_id = ?";
    const [count] = await connection.execute(query, [employee_id]);
    return count[0].employee_count;

}

module.exports = { getCustomerCountForEmployee};