/**
 * In-memory Todo service
 *
 * NOTE: This is a small, self-contained service created specifically for
 * this Express exercise. It intentionally mirrors the shape of the ToDo
 * data used in the Node phase (Task 04/05), but it is NOT literally
 * imported from those files - they live in a different folder/module
 * context. This file plays the same conceptual role ("shared todoService
 * logic") for the purposes of this task: implement it once here, then
 * require() it locally from your Express app in task-04.js.
 *
 * No Express dependency here on purpose - keep this module framework-agnostic.
 */

let todos = [];
let nextId = 1;

/**
 * Return all todos, optionally filtered.
 * @param {Object} [filters]
 * @param {boolean} [filters.completed] - filter by completion status
 * @returns {Array<Object>}
 */
function getAll(filters = {}) {
  // TODO: Implement getAll
  // 1. Start with the full `todos` array
  // 2. If filters.completed is a boolean, keep only todos with a matching
  //    `completed` value
  // 3. Return the (possibly filtered) array

  console.log("todoService.getAll not implemented yet");
  return [];
}

/**
 * Find a single todo by id.
 * @param {number|string} id
 * @returns {Object|undefined}
 */
function getById(id) {
  // TODO: Implement getById
  // 1. Convert id to a number
  // 2. Find and return the matching todo from `todos`
  // 3. Return undefined if not found

  console.log("todoService.getById not implemented yet");
  return undefined;
}

/**
 * Create a new todo.
 * @param {Object} data
 * @param {string} data.title
 * @param {string} [data.description]
 * @param {boolean} [data.completed]
 * @returns {Object} the created todo
 */
function create(data) {
  // TODO: Implement create
  // 1. Build a new todo object:
  //      {
  //        id: nextId++,
  //        title: data.title,
  //        description: data.description || "",
  //        completed: Boolean(data.completed) || false,
  //        createdAt: new Date(),
  //        updatedAt: new Date(),
  //      }
  // 2. Push it onto `todos`
  // 3. Return the created todo

  console.log("todoService.create not implemented yet");
  return null;
}

/**
 * Update an existing todo by id (partial update).
 * @param {number|string} id
 * @param {Object} changes
 * @returns {Object|undefined} the updated todo, or undefined if not found
 */
function update(id, changes) {
  // TODO: Implement update
  // 1. Find the todo by id (reuse getById logic or search `todos` directly)
  // 2. If not found, return undefined
  // 3. Merge `changes` into the existing todo (title/description/completed)
  // 4. Set updatedAt = new Date()
  // 5. Return the updated todo

  console.log("todoService.update not implemented yet");
  return undefined;
}

/**
 * Remove a todo by id.
 * @param {number|string} id
 * @returns {boolean} true if a todo was removed, false otherwise
 */
function remove(id) {
  // TODO: Implement remove
  // 1. Find the index of the todo with the given id
  // 2. If not found, return false
  // 3. Remove it from `todos` with splice()
  // 4. Return true

  console.log("todoService.remove not implemented yet");
  return false;
}

/**
 * Reset in-memory state. Handy for tests.
 */
function reset() {
  todos = [];
  nextId = 1;
}

module.exports = { getAll, getById, create, update, remove, reset };
