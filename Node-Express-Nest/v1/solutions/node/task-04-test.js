/**
 * Test suite for Task 04 - Todo REST API Server
 * Run this after implementing your HTTP server functionality
 */

const http = require("http");
const TodoServer = require("./task-04");

class TodoServerTester {
  constructor() {
    this.testResults = [];
    this.baseUrl = "http://localhost:3001"; // Use different port for testing
    this.server = null;
    this.testServer = null;
  }

  /**
   * Run a single test case
   */
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

  /**
   * Setup test environment
   */
  async setupTestEnvironment() {
    // Start test server on port 3001
    this.server = new TodoServer(3001);

    // Create a promise to wait for server to start
    await new Promise((resolve, reject) => {
      try {
        this.testServer = http.createServer((req, res) => {
          this.server.handleRequest(req, res);
        });

        this.testServer.listen(3001, () => {
          console.log("Test server started on port 3001");
          resolve();
        });

        this.testServer.on("error", (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });

    // Wait a bit for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  /**
   * Cleanup test environment
   */
  async cleanupTestEnvironment() {
    if (this.testServer) {
      this.testServer.close();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  /**
   * Make HTTP request to test server
   */
  async makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: 3001,
        path: path,
        method: method,
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
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: parsedBody,
            });
          } catch (error) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: body,
            });
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  /**
   * Test: Server should start and respond
   */
  async testServerBasics() {
    const response = await this.makeRequest("GET", "/todos");

    if (response.statusCode === 501) {
      throw new Error(
        "Server started but endpoints not implemented yet - this is expected for TODO template"
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(
        `Server should respond with success status, got ${response.statusCode}`
      );
    }

    if (!response.headers["content-type"]?.includes("application/json")) {
      throw new Error("Response should have Content-Type: application/json");
    }
  }

  /**
   * Test: GET /todos should return all todos
   */
  async testGetAllTodos() {
    const response = await this.makeRequest("GET", "/todos");

    if (response.statusCode === 501) {
      throw new Error("GET /todos not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(
        `GET /todos should return 200, got ${response.statusCode}`
      );
    }

    if (!response.body.success) {
      throw new Error("Response should have success: true");
    }

    if (!Array.isArray(response.body.data)) {
      throw new Error("Response should have data array");
    }

    if (typeof response.body.count !== "number") {
      throw new Error("Response should have count number");
    }
  }

  /**
   * Test: POST /todos should create new todo
   */
  async testCreateTodo() {
    const newTodo = {
      title: "Test Todo",
      description: "This is a test todo",
    };

    const response = await this.makeRequest("POST", "/todos", newTodo);

    if (response.statusCode === 501) {
      throw new Error("POST /todos not implemented yet (returns 501)");
    }

    if (response.statusCode !== 201) {
      throw new Error(
        `POST /todos should return 201, got ${response.statusCode}`
      );
    }

    if (!response.body.success) {
      throw new Error("Response should have success: true");
    }

    if (!response.body.data) {
      throw new Error("Response should have data object");
    }

    const todo = response.body.data;
    if (!todo.id || !todo.title || !todo.createdAt || !todo.updatedAt) {
      throw new Error(
        "Created todo should have id, title, createdAt, updatedAt"
      );
    }

    if (todo.completed !== false) {
      throw new Error("New todo should have completed: false by default");
    }
  }

  /**
   * Test: GET /todos/:id should return specific todo
   */
  async testGetTodoById() {
    // First create a todo
    const newTodo = {
      title: "Test Todo for Get by ID",
      description: "Test description",
    };

    const createResponse = await this.makeRequest("POST", "/todos", newTodo);

    if (createResponse.statusCode === 501) {
      throw new Error("Cannot test GET by ID - POST not implemented");
    }

    const todoId = createResponse.body.data?.id;
    if (!todoId) {
      throw new Error(
        "Cannot test GET by ID - POST didn't return valid todo with ID"
      );
    }

    // Now test getting by ID
    const response = await this.makeRequest("GET", `/todos/${todoId}`);

    if (response.statusCode === 501) {
      throw new Error("GET /todos/:id not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(
        `GET /todos/:id should return 200, got ${response.statusCode}`
      );
    }

    if (!response.body.success) {
      throw new Error("Response should have success: true");
    }

    if (!response.body.data || response.body.data.id !== todoId) {
      throw new Error("Response should return the correct todo");
    }
  }

  /**
   * Test: PUT /todos/:id should update todo
   */
  async testUpdateTodo() {
    // First create a todo
    const newTodo = {
      title: "Test Todo for Update",
      description: "Original description",
    };

    const createResponse = await this.makeRequest("POST", "/todos", newTodo);

    if (createResponse.statusCode === 501) {
      throw new Error("Cannot test PUT - POST not implemented");
    }

    const todoId = createResponse.body.data?.id;
    if (!todoId) {
      throw new Error(
        "Cannot test PUT - POST didn't return valid todo with ID"
      );
    }

    // Update the todo
    const updateData = {
      title: "Updated Todo Title",
      completed: true,
    };

    const response = await this.makeRequest(
      "PUT",
      `/todos/${todoId}`,
      updateData
    );

    if (response.statusCode === 501) {
      throw new Error("PUT /todos/:id not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(
        `PUT /todos/:id should return 200, got ${response.statusCode}`
      );
    }

    if (!response.body.success) {
      throw new Error("Response should have success: true");
    }

    const updatedTodo = response.body.data;
    if (
      updatedTodo.title !== "Updated Todo Title" ||
      updatedTodo.completed !== true
    ) {
      throw new Error("Todo should be updated with new values");
    }

    if (updatedTodo.description !== "Original description") {
      throw new Error("Unchanged fields should remain the same");
    }
  }

  /**
   * Test: DELETE /todos/:id should delete todo
   */
  async testDeleteTodo() {
    // First create a todo
    const newTodo = {
      title: "Test Todo for Delete",
      description: "This todo will be deleted",
    };

    const createResponse = await this.makeRequest("POST", "/todos", newTodo);

    if (createResponse.statusCode === 501) {
      throw new Error("Cannot test DELETE - POST not implemented");
    }

    const todoId = createResponse.body.data?.id;
    if (!todoId) {
      throw new Error(
        "Cannot test DELETE - POST didn't return valid todo with ID"
      );
    }

    // Delete the todo
    const response = await this.makeRequest("DELETE", `/todos/${todoId}`);

    if (response.statusCode === 501) {
      throw new Error("DELETE /todos/:id not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(
        `DELETE /todos/:id should return 200, got ${response.statusCode}`
      );
    }

    if (!response.body.success) {
      throw new Error("Response should have success: true");
    }

    if (!response.body.message) {
      throw new Error("Response should have success message");
    }

    // Verify todo is deleted by trying to get it
    const getResponse = await this.makeRequest("GET", `/todos/${todoId}`);
    if (getResponse.statusCode !== 404) {
      throw new Error("Deleted todo should return 404 when accessed");
    }
  }

  /**
   * Test: Error handling for invalid requests
   */
  async testErrorHandling() {
    // Test 404 for non-existent todo
    const response404 = await this.makeRequest("GET", "/todos/99999");

    if (response404.statusCode === 501) {
      // If endpoints not implemented, skip this test
      return;
    }

    if (response404.statusCode !== 404) {
      throw new Error("Non-existent todo should return 404");
    }

    if (response404.body.success !== false) {
      throw new Error("Error response should have success: false");
    }

    // Test 400 for invalid JSON (if POST is implemented)
    try {
      const response400 = await this.makeRequest(
        "POST",
        "/todos",
        "invalid json"
      );
      if (response400.statusCode === 501) {
        return; // POST not implemented, skip
      }

      if (response400.statusCode !== 400) {
        throw new Error("Invalid JSON should return 400");
      }
    } catch (error) {
      // Expected for malformed JSON
    }
  }

  /**
   * Test: Query parameter filtering
   */
  async testQueryFiltering() {
    // Create completed and incomplete todos first
    await this.makeRequest("POST", "/todos", {
      title: "Completed Todo",
      completed: true,
    });
    await this.makeRequest("POST", "/todos", {
      title: "Incomplete Todo",
      completed: false,
    });

    // Test filtering by completed status
    const completedResponse = await this.makeRequest(
      "GET",
      "/todos?completed=true"
    );

    if (completedResponse.statusCode === 501) {
      throw new Error("Query filtering not implemented yet (returns 501)");
    }

    if (completedResponse.statusCode !== 200) {
      throw new Error("Query filtering should work");
    }

    // Check that filtering works (basic check)
    if (!Array.isArray(completedResponse.body.data)) {
      throw new Error("Filtered response should return data array");
    }
  }

  /**
   * Test: CORS headers
   */
  async testCORSHeaders() {
    const response = await this.makeRequest("GET", "/todos");

    if (response.statusCode === 501) {
      throw new Error("Cannot test CORS - endpoints not implemented");
    }

    const corsOrigin = response.headers["access-control-allow-origin"];
    const corsMethods = response.headers["access-control-allow-methods"];

    if (!corsOrigin) {
      throw new Error(
        "Response should include CORS Access-Control-Allow-Origin header"
      );
    }

    if (!corsMethods) {
      throw new Error(
        "Response should include CORS Access-Control-Allow-Methods header"
      );
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log("🚀 Starting Todo Server Tests...\n");

    await this.setupTestEnvironment();

    try {
      await this.runTest("Server: Basic functionality", () =>
        this.testServerBasics()
      );
      await this.runTest("GET /todos: Get all todos", () =>
        this.testGetAllTodos()
      );
      await this.runTest("POST /todos: Create new todo", () =>
        this.testCreateTodo()
      );
      await this.runTest("GET /todos/:id: Get todo by ID", () =>
        this.testGetTodoById()
      );
      await this.runTest("PUT /todos/:id: Update todo", () =>
        this.testUpdateTodo()
      );
      await this.runTest("DELETE /todos/:id: Delete todo", () =>
        this.testDeleteTodo()
      );
      await this.runTest("Error: Error handling", () =>
        this.testErrorHandling()
      );
      await this.runTest("Query: Filtering support", () =>
        this.testQueryFiltering()
      );
      await this.runTest("CORS: Headers present", () => this.testCORSHeaders());

      this.printResults();
    } finally {
      await this.cleanupTestEnvironment();
    }
  }

  /**
   * Print test results summary
   */
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
      `📈 Success Rate: ${Math.round(
        (passed / this.testResults.length) * 100
      )}%`
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
        "\n🌟 Great job! Your Todo Server implementation is working correctly!"
      );
      console.log("💡 Try implementing the bonus features:");
      console.log("   - Request logging middleware");
      console.log("   - Request rate limiting");
      console.log("   - Data persistence to file system");
      console.log("   - HTML client interface");
    } else {
      console.log("\n💡 Implementation Tips:");
      console.log("   - Start with basic server structure");
      console.log("   - Implement helper functions first");
      console.log("   - Add CRUD operations one by one");
      console.log("   - Test each endpoint as you implement it");
    }
  }
}

/**
 * Main test execution
 */
async function runTests() {
  try {
    const tester = new TodoServerTester();
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
    console.log(
      "\n💡 Make sure you have implemented the TodoServer class in task-04.js"
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  console.log("🧪 Todo Server Test Suite");
  console.log("==========================\n");
  runTests();
}

module.exports = { TodoServerTester, runTests };
