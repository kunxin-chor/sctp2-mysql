-- SELECT <what cols> FROM <which table>
-- If the cols is `*`, it means all the columns
SELECT * FROM employees;

-- We can specify which columns we want from the table
SELECT firstName, lastName, email FROM employees;

-- Rename the columns after you have selected them
SELECT firstName AS 'First Name', lastName AS 'Last Name', email AS 'Email' FROM employees;

-- WHERE
-- We use the `where` clause to filter rows in a table

-- Only show employees from office code 1
SELECT * FROM employees WHERE officeCode=1;

-- Only show the first name, last name and email address from offic code 1
SELECT firstName, lastName, email FROM employees WHERE officeCode=1;

-- Show the customerName and phone number for all customers from France
SELECT customerName, phone, country FROM customers WHERE country="France"

-- Search by a string pattern, we use LIKE and a % to reperesent the wildcard (LIKE is not case sensitive)

-- Select any rows where job title begins with "sales"
SELECT * FROM employees WHERE jobTitle LIKE "sales%"

-- Select any rows where job titles end with "sales"
SELECT * FROM employees WHERE jobTitle LIKE "%sales";

-- Select any rows here job title contains the word "sales" anywhere
SELECT * FROM employees WHERE jobTitle LIKE "%sales%";

-- Find all the orders where the word "DHL" is mentioned in the comments
SELECT orderNumber, comments FROM orders WHERE comments LIKE '%dhl%'

-- Get employees from office code 1 or office code 2
SELECT * FROM employees WHERE officeCode = 1 OR officeCode = 2;

-- find all the customers in USA where their credit limit is more than 10k
SELECT * FROM customers WHERE creditLimit > 10000 AND country="USA";

-- When mixing AND/OR together, use parenthesis to state precedence
-- find all the customers in USA or Singapore and at the same time where their credit limit is less than 10k
SELECT * FROM customers WHERE creditLimit < 10000 AND (country="USA" OR country="Singapore");

-- JOINS allows us to combine two tables together based on a criteria
-- For each employee display their first name, last name, email, office city and office address
SELECT firstName, lastName, email, city,  addressLine1, addressLine2 FROM employees 
    JOIN offices
	  ON employees.officeCode = offices.officeCode
 

 -- For each employee display their first name, last name, email, office city and office address
SELECT firstName, lastName, email, city,  addressLine1, addressLine2 FROM employees 
    JOIN offices
	  ON employees.officeCode = offices.officeCode
	WHERE employees.officeCode = 1
 
 -- For each customer, display the customer name, and the name and email of the sales rep
SELECT customerName, firstName, lastName, email FROM customers JOIN employees
 ON customers.salesRepEmployeeNumber = employees.employeeNumber

--  only limit to customers where credit limit is more than 100000
 SELECT customerName, firstName, lastName, email FROM customers JOIN employees
 ON customers.salesRepEmployeeNumber = employees.employeeNumber
 WHERE creditLimit > 100000;

 -- SORT BY ASCENDING ORDER

 -- Display customers and sort them from lowest credit limit to highest
 SELECT * FROM customers ORDER BY creditLimit;

 SELECT * FROM customers ORDER BY creditLimit ASC;

 -- DESCENDING ORDER: use `DESC`
 SELECT * FROM customers ORDER BY creditLimit DESC;

-- Filter before sorting
 SELECT customerName, creditLimit FROM customers 
WHERE country="USA"
ORDER BY creditLimit DESC;

-- LIMIT allows us to only get a few results
SELECT customerName, creditLimit FROM customers 
WHERE country="USA"
ORDER BY creditLimit DESC
LIMIT 10;  -- LIMIT 10 means the first ten results

-- We can sort and limit a joined table (before joins happen first)
SELECT customerName, creditLimit, firstName, lastName FROM customers JOIN employees
ON customers.salesRepEmployeeNumber = employees.employeeNumber
WHERE country="USA"
ORDER BY creditLimit DESC
LIMIT 10;

-- AGGREGATE FUNCTIONS

-- Count how many employees there are
SELECT COUNT(*) FROM employees;

-- Count how many employees there are in office code 1
SELECT COUNT(*) FROM employees WHERE officeCode = 1;

-- Find the average credit limit among all the customers
SELECT AVG(creditLimit) FROM customers;

-- Find the maximum credit limit
SELECT MAX(creditLimit) FROM customers;

-- find the minimum credit limit
SELECT MIN(creditLimit) FROM customers;

-- Find the total credit limit of all the customers
SELECT SUM(creditLimit) FROM customers;

-- GROUPING

-- show how many employees are there in each office code
SELECT officeCode, COUNT(*) FROM employees 
GROUP BY officeCode

-- For each country, show how many customers there are
SELECT country, COUNT(*) FROM customers
GROUP BY country  -- Whatever you group by you must select

-- for each product, how many times they have been ordered
SELECT productCode, COUNT(*) FROM orderdetails
GROUP BY productCode

-- Filtering before searching
SELECT country, AVG(creditLimit) FROM customers
WHERE creditLimit > 0
GROUP BY country

-- Show the number of employees for office
-- and only show those with at least 3 employees
SELECT officeCode, COUNT(*) FROM employees
GROUP BY officeCode
HAVING COUNT(*) >= 3

-- for each sales rep whose office is in the USA, show all the sales rep who have at least five customers
-- showing them in descending order and only the top 5
SELECT employeeNumber, COUNT(*) AS 'Customer Count' FROM employees JOIN customers
   	ON employees.employeeNumber = customers.salesRepEmployeeNumber
   JOIN offices
    ON employees.officeCode = offices.officeCode
WHERE offices.country = "USA"
GROUP BY employeeNumber
HAVING `Customer Count` >= 5
ORDER BY `Customer Count` DESC
LIMIT 10;
   
-- DATES
-- find all the orders placed before the year 2004 (this will only work if the orderDate column is 
-- using the date data type)
SELECT * FROM orders WHERE orderDate <= "2004-01-01"

-- find all the orders between June 2004 to Aug 2004
SELECT * FROM orders WHERE orderDate >= "2004-06-01" AND orderDate <= "2004-08-31";

-- find all the orders that have shipped more than 1 day late
SELECT * FROM orders WHERE shippedDate - requiredDate > 1

-- MONTH, DAY and YEAR
-- find all the orders that are placed in the year 2004
SELECT * FROM orders WHERE YEAR(orderDate) = 2004;

-- show the number of orders placed each year
SELECT YEAR(orderDate), COUNT(*) FROM orders
GROUP BY YEAR(orderDate)

-- For the year 2003, show how many orders are placed per month
SELECT MONTH(orderDate), COUNT(*) FROM orders
WHERE YEAR(orderDate) = 2003
GROUP BY MONTH(orderDate);