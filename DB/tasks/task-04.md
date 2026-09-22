---
topic: "SQL RELATIONSHIPS"
taskNumber: 4
---

# Task 04: Creating a Users Table and Linking Todos to Users with a Foreign Key (Raw SQL)

In this task, you will use **raw SQL** to create a `users` table and establish a relationship between users and todos. This will allow each todo to be associated with a specific user.

## Step-by-step Instructions

1. **Create the `users` Table:**

   - Write a SQL statement to create a table named `users` with the following columns:
     - `id`: auto-incrementing primary key (integer)
     - `name`: user's name (text, cannot be empty)
     - `email`: user's email (text, must be unique, cannot be empty)
     - `created_at`: date and time when the user was created (timestamp, default to current time)

2. **Alter the `todos` Table:**
   - Write a SQL statement to add a new column `user_id` (integer) to the `todos` table.
   - Write a SQL statement to add a foreign key constraint on `todos.user_id` referencing `users(id)`.

## Document Your Work

After completing all previous steps, document your work in `solutions/task-04.txt`:

- Write down all terminal commands you used to interact with the database.
- Include all SQL queries you executed.
- Briefly describe what you did and any issues you encountered.
