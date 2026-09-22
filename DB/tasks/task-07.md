---
topic: "ORM SETUP"
taskNumber: 7
---

# Task 07: Connecting Your Todo Project to a Database Using an ORM

In this task, you will move from raw SQL to using an **ORM (Object-Relational Mapping)** tool. ORMs allow you to interact with your database using code, making it easier to manage migrations, models, and seed data in your todo-list project.

## Step-by-step Instructions

1. **Choose and Install an ORM:**

   - Select an ORM suitable for your tech stack (for example: [Sequelize](https://sequelize.org/) for Node.js, [TypeORM](https://typeorm.io/), or [Prisma](https://www.prisma.io/)).
   - Install the ORM and any required database drivers in your project.

2. **Configure the ORM:**

   - Set up the ORM to connect to your existing database (the one you used for previous tasks).
   - Add the connection configuration to your project (usually in a config file or environment variables).

3. **Define Models and Run Migrations:**

   - Use the ORM's migration system to define models for the `users` and `todos` tables.
   - Choose appropriate fields and relationships for these tables based on your understanding of a todo-list application.
   - Run the migrations to create the tables in your database.

4. **Write a Seed Script:**

   - Create a script (using the ORM's seeding functionality) to populate the database with initial data.
   - Add at least 2 users and 3 todos for each user.

## Document Your Work

After completing all previous steps, document your work in `solutions/task-07.txt`:

- Provide a link to the pull request where you implemented the solution, or list the relevant commit hashes if a pull request is not available.
- Briefly describe what you did and any issues you encountered.
