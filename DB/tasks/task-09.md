---
topic: "SQL TRIGGERS/AUDIT"
taskNumber: 9
---

# Task 09: Implementing an Audit Log Trigger (Raw SQL)

In this task, you will use **raw SQL** to create a trigger that automatically logs changes to your `todos` table. This is a common real-world requirement for tracking updates and deletions in important tables.

## Step-by-step Instructions

1. **Create an `audit_log` Table:**

   - Write a SQL statement to create a table named `audit_log` with the following columns:
     - `id`: auto-incrementing primary key (integer)
     - `todo_id`: the ID of the todo that was changed (integer)
     - `action`: the type of action performed (text, e.g., 'UPDATE' or 'DELETE')
     - `changed_at`: the date and time when the change occurred (timestamp, default to current time)

2. **Create a Trigger for Updates:**

   - Write a SQL trigger that, whenever a row in the `todos` table is updated, automatically inserts a record into the `audit_log` table with the todo's ID, the action ('UPDATE'), and the current timestamp.

3. **Create a Trigger for Deletes:**
   - Write a SQL trigger that, whenever a row in the `todos` table is deleted, automatically inserts a record into the `audit_log` table with the todo's ID, the action ('DELETE'), and the current timestamp.

## Document Your Work

After completing all previous steps, document your work in `solutions/task-09.txt`:

- Provide a link to the pull request where you implemented the solution, or list the relevant commit hashes if a pull request is not available.
- Briefly describe what you did and any issues you encountered.
