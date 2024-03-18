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
 
 