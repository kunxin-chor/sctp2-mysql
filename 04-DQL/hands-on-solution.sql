-- Q1
SELECT city, phone, country FROM offices;

-- Q2
SELECT comments FROM orders WHERE comments LIKE "%fedex%";

-- Q3
SELECT contactLastName, contactFirstName 
    FROM customers ORDER BY customerName DESC;

-- Q4
SELECT firstName, lastName from employees
 WHERE (officeCode = 1 OR officeCode =2 OR officeCode = 3)
  AND (lastName LIKE "%son%" or firstName LIKE "%son%")


-- Alternatie solution for Q4
SELECT firstName, lastName from employees
 WHERE officeCode IN (1,2,3)
  AND (lastName LIKE "%son%" or firstName LIKE "%son%")

-- Q5
SELECT orderNumber, customerNumber, customerName, contactFirstName, contactLastName
 FROM orders JOIN customers
  ON orders.customerNumber = customers.customerNumber
WHERE orders.customerNumber = 124

-- Q6
SELECT products.productName, orderdetails.* FROM orderdetails JOIN products
 ON products.productCode = orderdetails.productCode