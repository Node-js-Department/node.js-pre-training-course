/**
 * Test suite for Task 03 - Centralized Error Handler
 * Run this after implementing your error middleware/routes to verify functionality
 */

const http = require("http");
const { createApp } = require("./task-03");

class ErrorHandlerTester {
  constructor() {
    this.testResults = [];
    this.port = 4003;
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

  async makeRequest(path) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: this.port,
        path,
        method: "GET",
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
      req.end();
    });
  }

  /**
   * Test: /ok should respond normally
   */
  async testOkRoute() {
    const response = await this.makeRequest("/ok");

    if (response.statusCode === 501) {
      throw new Error("GET /ok not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
  }

  /**
   * Helper to assert the standard error envelope shape
   */
  assertErrorEnvelope(body) {
    if (typeof body.status !== "number") {
      throw new Error("Error response should include a numeric status");
    }
    if (typeof body.message !== "string") {
      throw new Error("Error response should include a string message");
    }
    if (typeof body.timestamp !== "string") {
      throw new Error("Error response should include a string timestamp");
    }
  }

  /**
   * Test: synchronous throw should be caught and formatted
   */
  async testSyncError() {
    const response = await this.makeRequest("/error/sync");

    if (response.statusCode === 501) {
      throw new Error("GET /error/sync not implemented yet (returns 501)");
    }

    if (response.statusCode !== 500) {
      throw new Error(
        `Sync error should return 500, got ${response.statusCode}`
      );
    }

    this.assertErrorEnvelope(response.body);
  }

  /**
   * Test: async throw/rejection should be caught and formatted
   */
  async testAsyncError() {
    const response = await this.makeRequest("/error/async");

    if (response.statusCode === 501) {
      throw new Error("GET /error/async not implemented yet (returns 501)");
    }

    if (response.statusCode !== 500) {
      throw new Error(
        `Async error should return 500, got ${response.statusCode}`
      );
    }

    this.assertErrorEnvelope(response.body);
  }

  /**
   * Test: custom AppError should preserve its status code
   */
  async testCustomError() {
    const response = await this.makeRequest("/error/custom");

    if (response.statusCode === 501) {
      throw new Error("GET /error/custom not implemented yet (returns 501)");
    }

    if (response.statusCode !== 404) {
      throw new Error(
        `Custom AppError should return 404, got ${response.statusCode}`
      );
    }

    this.assertErrorEnvelope(response.body);

    if (response.body.status !== 404) {
      throw new Error("Error body status should match the AppError code (404)");
    }
  }

  async runAllTests() {
    console.log("🚀 Starting Centralized Error Handler Tests...\n");

    await this.setupTestEnvironment();

    try {
      await this.runTest("GET /ok: Success path works", () =>
        this.testOkRoute()
      );
      await this.runTest("GET /error/sync: Sync error caught", () =>
        this.testSyncError()
      );
      await this.runTest("GET /error/async: Async error caught", () =>
        this.testAsyncError()
      );
      await this.runTest("GET /error/custom: Custom status preserved", () =>
        this.testCustomError()
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
        "\n🌟 Great job! Your centralized error handler is working correctly!"
      );
      console.log("💡 Try implementing the bonus features:");
      console.log("   - Add a 404 handler for unknown routes");
      console.log("   - Distinguish operational vs programmer errors");
      console.log("   - Add a requestId field for traceability");
    } else {
      console.log("\n💡 Implementation Tips:");
      console.log("   - Implement the AppError class first");
      console.log("   - Make the routes throw the expected errors");
      console.log(
        "   - Register the error middleware LAST, with 4 parameters"
      );
    }
  }
}

async function runTests() {
  try {
    const tester = new ErrorHandlerTester();
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
    console.log(
      "\n💡 Make sure you have implemented the routes and error middleware in task-03.js"
    );
  }
}

if (require.main === module) {
  console.log("🧪 Centralized Error Handler Test Suite");
  console.log("=========================================\n");
  runTests();
}

module.exports = { ErrorHandlerTester, runTests };
