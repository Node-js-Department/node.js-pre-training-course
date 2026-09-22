/**
 * Test suite for Task 04 - Wire Up ToDo REST API
 * Run this after implementing todoService.js and task-04.js to verify functionality
 */

const http = require("http");
const todoService = require("./todoService");
const { createApp } = require("./task-04");

class TodoApiTester {
  constructor() {
    this.testResults = [];
    this.port = 4004;
    this.server = null;
  }

  async runTest(name, testFunction) {
    try {
      console.log(`🧪 Running: ${name}`);
      await testFunction();
      console.log(`✅ Passed: ${name}`);
      this.testResults.push({ name, status: "PASS" });
    } catch (error) {
      console.log(`❌ Failed: ${name} - ${error.message}`);
      this.testResults.push({ name, status: "FAIL", error: error.message });
    }
  }

  async setupTestEnvironment() {
    todoService.reset();

    const app = createApp();

    await new Promise((resolve, reject) => {
      this.server = app.listen(this.port, () => {
        console.log(`Test server started on port ${this.port}`);
        resolve();
      });

      this.server.on("error", reject);
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  async cleanupTestEnvironment() {
    if (this.server) {
      await new Promise((resolve) => this.server.close(resolve));
    }
  }

  async makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: this.port,
        path,
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const req = http.request(options, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            resolve({ statusCode: res.statusCode, body: parsedBody });
          } catch (error) {
            resolve({ statusCode: res.statusCode, body });
          }
        });
      });

      req.on("error", reject);

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // ---------------------------------------------------------------------
  // todoService unit tests
  // ---------------------------------------------------------------------

  testServiceCreateAndGetById() {
    todoService.reset();

    const created = todoService.create({ title: "Learn Express" });

    if (!created || typeof created !== "object") {
      throw new Error("create() should return the created todo object");
    }

    if (!created.id || created.title !== "Learn Express") {
      throw new Error("Created todo should have an id and matching title");
    }

    if (created.completed !== false) {
      throw new Error("New todos should default to completed: false");
    }

    const found = todoService.getById(created.id);
    if (!found || found.id !== created.id) {
      throw new Error("getById() should return the todo that was created");
    }
  }

  testServiceUpdateAndRemove() {
    todoService.reset();

    const created = todoService.create({ title: "Original title" });
    const updated = todoService.update(created.id, { completed: true });

    if (!updated || updated.completed !== true) {
      throw new Error("update() should apply the given changes");
    }

    if (updated.title !== "Original title") {
      throw new Error("update() should preserve fields that were not changed");
    }

    const removed = todoService.remove(created.id);
    if (removed !== true) {
      throw new Error("remove() should return true when a todo is deleted");
    }

    const afterRemoval = todoService.getById(created.id);
    if (afterRemoval !== undefined) {
      throw new Error("getById() should return undefined after removal");
    }
  }

  testServiceGetAllWithFilter() {
    todoService.reset();

    todoService.create({ title: "Done task", completed: true });
    todoService.create({ title: "Pending task", completed: false });

    const completedOnly = todoService.getAll({ completed: true });

    if (!Array.isArray(completedOnly)) {
      throw new Error("getAll() should return an array");
    }

    if (!completedOnly.every((todo) => todo.completed === true)) {
      throw new Error("getAll({ completed: true }) should only return completed todos");
    }
  }

  // ---------------------------------------------------------------------
  // Express integration tests
  // ---------------------------------------------------------------------

  async testGetAllTodosEndpoint() {
    const response = await this.makeRequest("GET", "/todos");

    if (response.statusCode === 501) {
      throw new Error("GET /todos not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(`GET /todos should return 200, got ${response.statusCode}`);
    }

    if (!response.body.success || !Array.isArray(response.body.data)) {
      throw new Error("GET /todos should return { success: true, data: [...] }");
    }

    if (response.body.count !== response.body.data.length) {
      throw new Error(
        `GET /todos count (${response.body.count}) should match data.length (${response.body.data.length})`
      );
    }
  }

  async testCreateTodoEndpoint() {
    const response = await this.makeRequest("POST", "/todos", {
      title: "Buy milk",
    });

    if (response.statusCode === 501) {
      throw new Error("POST /todos not implemented yet (returns 501)");
    }

    if (response.statusCode !== 201) {
      throw new Error(`POST /todos should return 201, got ${response.statusCode}`);
    }

    if (!response.body.success || !response.body.data?.id) {
      throw new Error("POST /todos should return the created todo");
    }
  }

  async testValidationRejectsMissingTitle() {
    const response = await this.makeRequest("POST", "/todos", {
      description: "no title here",
    });

    if (response.statusCode === 501) {
      throw new Error("Validation middleware not implemented yet (returns 501)");
    }

    if (response.statusCode !== 400) {
      throw new Error(
        `POST /todos without title should return 400, got ${response.statusCode}`
      );
    }

    if (response.body.success !== false) {
      throw new Error("Validation error response should have success: false");
    }
  }

  async testValidationRejectsBlankTitle() {
    for (const title of ["", "   "]) {
      const response = await this.makeRequest("POST", "/todos", { title });

      if (response.statusCode === 501) {
        throw new Error("Validation middleware not implemented yet (returns 501)");
      }

      if (response.statusCode !== 400) {
        throw new Error(
          `POST /todos with title ${JSON.stringify(title)} should return 400 (title must be non-empty after trimming), got ${response.statusCode}`
        );
      }
    }
  }

  async testGetUpdateDeleteFlow() {
    const createResponse = await this.makeRequest("POST", "/todos", {
      title: "Flow test todo",
    });

    if (createResponse.statusCode === 501) {
      throw new Error("Cannot test flow - POST /todos not implemented yet");
    }

    const id = createResponse.body.data?.id;
    if (!id) {
      throw new Error("Cannot test flow - created todo has no id");
    }

    const getResponse = await this.makeRequest("GET", `/todos/${id}`);
    if (getResponse.statusCode !== 200 || getResponse.body.data?.id !== id) {
      throw new Error("GET /todos/:id should return the created todo");
    }

    const updateResponse = await this.makeRequest("PUT", `/todos/${id}`, {
      completed: true,
    });
    if (updateResponse.statusCode !== 200 || updateResponse.body.data?.completed !== true) {
      throw new Error("PUT /todos/:id should update the todo");
    }

    const deleteResponse = await this.makeRequest("DELETE", `/todos/${id}`);
    if (deleteResponse.statusCode !== 200 || !deleteResponse.body.success) {
      throw new Error("DELETE /todos/:id should succeed");
    }

    const getAfterDelete = await this.makeRequest("GET", `/todos/${id}`);
    if (getAfterDelete.statusCode !== 404) {
      throw new Error("GET /todos/:id after deletion should return 404");
    }
  }

  async runAllTests() {
    console.log("🚀 Starting Todo REST API (Express) Tests...\n");

    await this.runTest("todoService: create + getById", () =>
      this.testServiceCreateAndGetById()
    );
    await this.runTest("todoService: update + remove", () =>
      this.testServiceUpdateAndRemove()
    );
    await this.runTest("todoService: getAll with filter", () =>
      this.testServiceGetAllWithFilter()
    );

    await this.setupTestEnvironment();

    try {
      await this.runTest("GET /todos: List endpoint", () =>
        this.testGetAllTodosEndpoint()
      );
      await this.runTest("POST /todos: Create endpoint", () =>
        this.testCreateTodoEndpoint()
      );
      await this.runTest("POST /todos: Validation rejects missing title", () =>
        this.testValidationRejectsMissingTitle()
      );
      await this.runTest("POST /todos: Validation rejects blank/whitespace title", () =>
        this.testValidationRejectsBlankTitle()
      );
      await this.runTest("GET/PUT/DELETE /todos/:id: Full flow", () =>
        this.testGetUpdateDeleteFlow()
      );

      this.printResults();
    } finally {
      await this.cleanupTestEnvironment();
    }
  }

  printResults() {
    console.log("\n📊 Test Results:");
    console.log("==================");

    const passed = this.testResults.filter((r) => r.status === "PASS").length;
    const failed = this.testResults.filter((r) => r.status === "FAIL").length;

    if (failed > 0) {
      process.exitCode = 1;
    }

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(
      `📈 Success Rate: ${Math.round((passed / this.testResults.length) * 100)}%`
    );

    if (failed > 0) {
      console.log("\n❌ Failed Tests:");
      this.testResults
        .filter((r) => r.status === "FAIL")
        .forEach((r) => console.log(`  - ${r.name}: ${r.error}`));
    }

    console.log(
      "\n" +
        (failed === 0
          ? "🎉 All tests passed!"
          : "🔧 Some tests need attention.")
    );

    if (failed === 0) {
      console.log(
        "\n🌟 Great job! Your Todo REST API implementation is working correctly!"
      );
      console.log("💡 Try implementing the bonus features:");
      console.log("   - Add pagination and sorting to GET /todos");
      console.log("   - Reuse the AppError pattern from Task 03");
      console.log("   - Move the /todos routes to an express.Router()");
    } else {
      console.log("\n💡 Implementation Tips:");
      console.log("   - Start with todoService.js (CRUD functions)");
      console.log("   - Then wire up validateTodoBody");
      console.log("   - Finally implement the route handlers in task-04.js");
    }
  }
}

async function runTests() {
  try {
    const tester = new TodoApiTester();
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
    console.log(
      "\n💡 Make sure you have implemented todoService.js and task-04.js"
    );
  }
}

if (require.main === module) {
  console.log("🧪 Todo REST API (Express) Test Suite");
  console.log("=======================================\n");
  runTests();
}

module.exports = { TodoApiTester, runTests };
