/**
 * Test suite for Task 01 - Middleware Playground
 * Run this after implementing your middlewares/routes to verify functionality
 */

const http = require("http");
const { createApp } = require("./task-01");

class MiddlewarePlaygroundTester {
  constructor() {
    this.testResults = [];
    this.port = 4001;
    this.server = null;
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
   * Setup test environment - start the Express app on a test port
   */
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

  /**
   * Cleanup test environment
   */
  async cleanupTestEnvironment() {
    if (this.server) {
      await new Promise((resolve) => this.server.close(resolve));
    }
  }

  /**
   * Make HTTP request to the test server
   */
  async makeRequest(method, path) {
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
            resolve({ statusCode: res.statusCode, headers: res.headers, body: parsedBody });
          } catch (error) {
            resolve({ statusCode: res.statusCode, headers: res.headers, body });
          }
        });
      });

      req.on("error", reject);
      req.end();
    });
  }

  /**
   * Test: GET / should respond successfully
   */
  async testWelcomeRoute() {
    const response = await this.makeRequest("GET", "/");

    if (response.statusCode === 501) {
      throw new Error("GET / not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(`GET / should return 200, got ${response.statusCode}`);
    }
  }

  /**
   * Test: Header injector middleware should add a custom header to
   * EVERY response (it's global middleware, not route-specific logic).
   */
  async testHeaderInjected() {
    for (const path of ["/", "/about", "/sequence"]) {
      const response = await this.makeRequest("GET", path);

      if (response.statusCode === 501) {
        throw new Error(`GET ${path} not implemented yet (returns 501)`);
      }

      if (!response.headers["x-powered-by-course"]) {
        throw new Error(
          `GET ${path} should include a custom X-Powered-By-Course header (register headerInjector as global middleware, not per-route logic)`
        );
      }
    }
  }

  /**
   * Test: GET /sequence should report the correct middleware order
   */
  async testExecutionSequence() {
    const response = await this.makeRequest("GET", "/sequence");

    if (response.statusCode === 501) {
      throw new Error("GET /sequence not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(
        `GET /sequence should return 200, got ${response.statusCode}`
      );
    }

    const { executionLog } = response.body;

    if (!Array.isArray(executionLog)) {
      throw new Error("Response should include an executionLog array");
    }

    const expectedOrder = ["logger", "timer", "headerInjector"];
    for (const name of expectedOrder) {
      if (!executionLog.includes(name)) {
        throw new Error(`executionLog should include "${name}"`);
      }
    }

    const indices = expectedOrder.map((name) => executionLog.indexOf(name));
    const isOrdered = indices.every(
      (value, idx) => idx === 0 || value >= indices[idx - 1]
    );

    if (!isOrdered) {
      throw new Error(
        "Middlewares should run in order: logger -> timer -> headerInjector"
      );
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log("🚀 Starting Middleware Playground Tests...\n");

    await this.setupTestEnvironment();

    try {
      await this.runTest("GET /: Welcome route responds", () =>
        this.testWelcomeRoute()
      );
      await this.runTest("Header injector: Custom header present", () =>
        this.testHeaderInjected()
      );
      await this.runTest("GET /sequence: Middleware execution order", () =>
        this.testExecutionSequence()
      );

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
        "\n🌟 Great job! Your Middleware Playground implementation is working correctly!"
      );
      console.log("💡 Try implementing the bonus features:");
      console.log("   - Reject requests missing a User-Agent header");
      console.log("   - Make the injected header configurable");
      console.log("   - Add a /slow route and verify the timer logs it");
    } else {
      console.log("\n💡 Implementation Tips:");
      console.log("   - Start with the logger middleware");
      console.log("   - Then add the timer middleware");
      console.log("   - Then add the header injector middleware");
      console.log("   - Finally wire up the three routes");
    }
  }
}

/**
 * Main test execution
 */
async function runTests() {
  try {
    const tester = new MiddlewarePlaygroundTester();
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
    console.log(
      "\n💡 Make sure you have implemented the middlewares and routes in task-01.js"
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  console.log("🧪 Middleware Playground Test Suite");
  console.log("=====================================\n");
  runTests();
}

module.exports = { MiddlewarePlaygroundTester, runTests };
