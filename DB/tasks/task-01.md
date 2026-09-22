---
topic: "SQL SCHEMA"
taskNumber: 1
---

# Task 01: Setting Up and Creating the "users" and "todos" Tables with Raw SQL

In this task, you will use **raw SQL** (not an ORM or any abstraction) to set up the foundation for your todo-list project. You will install a relational database, optionally a GUI tool, and create two tables: `users` and `todos`.

## Step 1: Install a Relational Database

Choose and install one of the following databases on your computer:

- [PostgreSQL](https://www.postgresql.org/download/)
- [MySQL](https://dev.mysql.com/downloads/)

## Step 2: Install a Database GUI Tool

For easier database management, you can install a graphical tool such as:

- [DBeaver](https://dbeaver.io/download/)
- [TablePlus](https://tableplus.com/)
- [pgAdmin](https://www.pgadmin.org/download/) (for PostgreSQL)

These tools help you interact with your database without using the command line.

## Step 3: Create a New Database

Using your chosen database (and GUI tool, if installed), create a new database named, for example, `todo_app`.

## Step 4: Write Raw SQL to Create the Tables

Write a SQL script that creates the following table:

### `todos` table

- `id`: auto-incrementing primary key (integer)
- `title`: title of the todo (text, cannot be empty)
- `description`: longer description of the todo (text, can be empty)
- `status`: status of the todo (text, e.g., 'active', 'completed')
- `created_at`: date and time when the todo was created (timestamp, default to current time)
- `user_id`: references the `id` of the user who owns the todo (foreign key)

## Document Your Work

After completing all previous steps, you must document your work in the file `solutions/task-01.txt`:

- Write down all terminal commands you used to install the database and any other tools.
- Include all SQL queries you executed (for creating the database and tables).
- Briefly describe what you did and any issues you encountered.
