# Data Definition Language (DDL)
* It's for the creating tables in a MySQL server

# Log into MySQL
Login with the `root` user: `mysql -u root`

# Common MySQL commands

## Show all the databases on the server
```
show databases;
```

## Create a new database
```
create database <name of database>
```

For example, to create a database with the name `swimming_coach`, we use:
```
create database swimming_coach
```

## Change the active database
```
use database swimming_coach
```

## Create the `parents` table
```
create table parents (
    parent_id int unsigned auto_increment primary key,
    first_name varchar(200) not null,
    last_name varchar(200) default ''
) engine = innodb;
```

## Show all the tables in a database
```
show tables;
```

## Examine a table
```
describe parents;
```

## Create the locations table
```
create table locations (
  location_id int unsigned auto_increment primary key,
  name varchar(255),
  address varchar(255)
) engine = innodb;
```

## Insert one parent (Data Manipulation Language)
```
insert into parents (first_name, last_name) VALUES ("John", "Snow");
```

## Show all rows from a table (Data Query Language)
```
select * from parents;
```

## Insert many rows at one go (Data Manipulation Language)
```
insert into parents (first_name, last_name) values
 ("Mary", "Su"),  
 ("Alice", "White"),
 ("Jon", "Wick");
 ```

 ## Insert many locations at one go (Data Manipulation Language)
 ```
INSERT INTO locations (name, address) VALUES 
    ("Yishun Swimming Complex", "Yishun Ave 4"),
    ("Commonwealth Swimming Complex", "Commonwealth Drive"),
    ("Pioneer Swimming Complex", "Pioneer Way");
 ```

 # Foreign Keys

 ## 1. Create the `students` table without the foreign key
 ```
 CREATE TABLE students (
    student_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    swimming_level VARCHAR(45),
    dob DATE NOT NULL
 ) ENGINE = innodb;
```

## 2. Add in the column for the foreign key

We will use the `ALTER TABLE` command which allows us to make
changes to a table.

```
ALTER TABLE students ADD COLUMN parent_id INT UNSIGNED;
```

## 3. Define the foreign key
```
ALTER TABLE students ADD CONSTRAINT fk_students_parents
    FOREIGN KEY (parent_id) REFERENCES parents(parent_id);
```

## 4. Add in some students
```
INSERT INTO students (name, swimming_level, dob, parent_id) 
 VALUES ("Mary Snow", "Beginnner", "2019-01-01", 1);
```

# How to add a new column to a table?
Add email address to parent:
```
ALTER TABLE parents ADD COLUMN email VARCHAR(100);
```

# How to remove a column from a table
```
ALTER TABLE parents DROP COLUMN email;
```

# How to delete an entire table
```
DROP TABLE parents
```