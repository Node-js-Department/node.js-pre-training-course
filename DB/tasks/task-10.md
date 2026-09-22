---
topic: "REDIS CACHING"
taskNumber: 10
---

# Task 10: Caching the User's Todo List with Redis

In this task, you will use **Redis** (a NoSQL in-memory data store) to cache the list of todos for a user in your todo-list application. Caching can greatly improve performance by reducing the number of database queries for frequently accessed data.

## Step-by-step Instructions

1. **Set Up Redis:**

   - Install Redis on your computer or use a cloud-based Redis service.
   - Install a Redis client library for your programming language (e.g., `ioredis` or `redis` for Node.js).

2. **Implement Caching for the User's Todo List:**

   - When a user requests their todo list, first check if the data is available in Redis (e.g., key: `todos:user:{userId}`).
   - If the data is found in Redis, return it directly (cache hit).
   - If the data is not found (cache miss), fetch the todo list from the database, store it in Redis with a TTL (time-to-live, e.g., 5 minutes), and then return it to the user.

3. **Manual Cache Invalidation:**

   - Whenever a todo for that user is created, updated, or deleted, manually delete (invalidate) the cache for that user's todo list in Redis. This ensures users always see up-to-date data after changes.

4. **Demonstrate TTL Functionality:**

   - Show that cached data expires automatically after the TTL period by demonstrating a cache miss after the TTL has passed.

## Document Your Work

After completing all previous steps, document your work in `solutions/task-10.txt`:

- Provide a link to the pull request where you implemented the solution, or list the relevant commit hashes if a pull request is not available.
- Briefly describe what you did and any issues you encountered.
