/**
 * Test suite for Task 02 - Params and Queries Challenge with Validation
 * Run this after implementing your route/validation to verify functionality
 */

const http = require("http");
const { createApp } = require("./task-02");

class ParamsQueriesTester {
  constructor() {
    this.testResults = [];
    this.port = 4002;
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
   * Test: valid id + active=true
   */
  async testValidActiveUser() {
    const response = await this.makeRequest("/users/42?active=true");

    if (response.statusCode === 501) {
      throw new Error("GET /users/:id not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }

    if (response.body.message !== "User 42 is active") {
      throw new Error(
        `Expected message "User 42 is active", got "${response.body.message}"`
      );
    }
  }

  /**
   * Test: valid id + active=false
   */
  async testValidInactiveUser() {
    const response = await this.makeRequest("/users/7?active=false");

    if (response.statusCode === 501) {
      throw new Error("GET /users/:id not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }

    if (response.body.message !== "User 7 is inactive") {
      throw new Error(
        `Expected message "User 7 is inactive", got "${response.body.message}"`
      );
    }
  }

  /**
   * Test: non-numeric id should be rejected
   */
  async testInvalidId() {
    const response = await this.makeRequest("/users/abc?active=true");

    if (response.statusCode === 501) {
      throw new Error("Validation not implemented yet (returns 501)");
    }

    if (response.statusCode !== 400) {
      throw new Error(
        `Non-numeric id should return 400, got ${response.statusCode}`
      );
    }

    if (response.body.success !== false) {
      throw new Error("Error response should have success: false");
    }

    if (response.body.error !== "id must be a positive number") {
      throw new Error(
        `Expected error "id must be a positive number", got "${response.body.error}"`
      );
    }
  }

  /**
   * Test: invalid active value should be rejected
   */
  async testInvalidActive() {
    const response = await this.makeRequest("/users/42?active=maybe");

    if (response.statusCode === 501) {
      throw new Error("Validation not implemented yet (returns 501)");
    }

    if (response.statusCode !== 400) {
      throw new Error(
        `Invalid active value should return 400, got ${response.statusCode}`
      );
    }

    if (response.body.error !== "active must be 'true' or 'false'") {
      throw new Error(
        `Expected error "active must be 'true' or 'false'", got "${response.body.error}"`
      );
    }
  }

  /**
   * Test: missing active query param should be rejected
   */
  async testMissingActive() {
    const response = await this.makeRequest("/users/42");

    if (response.statusCode === 501) {
      throw new Error("Validation not implemented yet (returns 501)");
    }

    if (response.statusCode !== 400) {
      throw new Error(
        `Missing active should return 400, got ${response.statusCode}`
      );
    }

    if (response.body.error !== "active must be 'true' or 'false'") {
      throw new Error(
        `Expected error "active must be 'true' or 'false'", got "${response.body.error}"`
      );
    }
  }

  async runAllTests() {
    console.log("🚀 Starting Params and Queries Tests...\n");

    await this.setupTestEnvironment();

    try {
      await this.runTest("Valid: id=42, active=true", () =>
        this.testValidActiveUser()
      );
      await this.runTest("Valid: id=7, active=false", () =>
        this.testValidInactiveUser()
      );
      await this.runTest("Invalid: non-numeric id rejected", () =>
        this.testInvalidId()
      );
      await this.runTest("Invalid: bad active value rejected", () =>
        this.testInvalidActive()
      );
      await this.runTest("Invalid: missing active rejected", () =>
        this.testMissingActive()
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
        "\n🌟 Great job! Your validation implementation is working correctly!"
      );
      console.log("💡 Try implementing the bonus features:");
      console.log("   - Support an optional role query parameter");
      console.log("   - Return all validation errors at once");
      console.log("   - Add pagination validation for GET /users");
    } else {
      console.log("\n💡 Implementation Tips:");
      console.log("   - Implement validateUserParams first");
      console.log("   - Make sure it calls next() only when input is valid");
      console.log("   - Then implement the GET /users/:id handler");
    }
  }
}

async function runTests() {
  try {
    const tester = new ParamsQueriesTester();
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
    console.log(
      "\n💡 Make sure you have implemented validateUserParams and the route in task-02.js"
    );
  }
}

if (require.main === module) {
  console.log("🧪 Params and Queries Test Suite");
  console.log("==================================\n");
  runTests();
}

module.exports = { ParamsQueriesTester, runTests };
