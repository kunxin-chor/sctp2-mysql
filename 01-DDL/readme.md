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