/**
 * Test suite for Task 05 - Request Logging and Metrics Middleware
 * Run this after implementing your metrics middleware/endpoint to verify functionality
 */

const http = require("http");
const { createApp, MetricsTracker } = require("./task-05");

class MetricsTester {
  constructor() {
    this.testResults = [];
    this.port = 4005;
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

  async makeRequest(method, path) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: this.port,
        path,
        method,
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
   * Unit test for the MetricsTracker class in isolation
   */
  testMetricsTrackerUnit() {
    const tracker = new MetricsTracker();

    tracker.record("GET", 10);
    tracker.record("GET", 20);
    tracker.record("POST", 30);

    const snapshot = tracker.getSnapshot();

    if (snapshot.totalRequests !== 3) {
      throw new Error(
        `Expected totalRequests to be 3, got ${snapshot.totalRequests}`
      );
    }

    if (snapshot.averageResponseTimeMs !== 20) {
      throw new Error(
        `Expected averageResponseTimeMs to be 20, got ${snapshot.averageResponseTimeMs}`
      );
    }

    if (snapshot.requestsByMethod.GET !== 2 || snapshot.requestsByMethod.POST !== 1) {
      throw new Error("requestsByMethod should tally GET and POST separately");
    }
  }

  /**
   * Test: /metrics endpoint responds with the expected shape
   */
  async testMetricsEndpointShape() {
    const response = await this.makeRequest("GET", "/metrics");

    if (response.statusCode === 501) {
      throw new Error("GET /metrics not implemented yet (returns 501)");
    }

    if (response.statusCode !== 200) {
      throw new Error(`GET /metrics should return 200, got ${response.statusCode}`);
    }

    const data = response.body.data;

    if (!data || typeof data.totalRequests !== "number") {
      throw new Error("metrics data should include a numeric totalRequests");
    }

    if (typeof data.averageResponseTimeMs !== "number") {
      throw new Error("metrics data should include a numeric averageResponseTimeMs");
    }

    if (!data.requestsByMethod || typeof data.requestsByMethod !== "object") {
      throw new Error("metrics data should include a requestsByMethod object");
    }
  }

  /**
   * Test: totalRequests should increase as more requests are made
   */
  async testTotalsIncrease() {
    const before = await this.makeRequest("GET", "/metrics");
    if (before.statusCode === 501) {
      throw new Error("GET /metrics not implemented yet (returns 501)");
    }

    const beforeCount = before.body.data.totalRequests;

    await this.makeRequest("GET", "/");
    await this.makeRequest("GET", "/todos");

    // Give res.on("finish") listeners a tick to run before checking metrics again
    await new Promise((resolve) => setTimeout(resolve, 50));

    const after = await this.makeRequest("GET", "/metrics");
    const afterCount = after.body.data.totalRequests;

    if (afterCount <= beforeCount) {
      throw new Error(
        `Expected totalRequests to increase after making requests (before=${beforeCount}, after=${afterCount})`
      );
    }
  }

  /**
   * Test: requests to /metrics itself should not be counted
   */
  async testMetricsRouteExcluded() {
    const first = await this.makeRequest("GET", "/metrics");
    if (first.statusCode === 501) {
      throw new Error("GET /metrics not implemented yet (returns 501)");
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    const second = await this.makeRequest("GET", "/metrics");

    if (second.body.data.totalRequests !== first.body.data.totalRequests) {
      throw new Error(
        "Requests to /metrics should not increase the totalRequests counter"
      );
    }
  }

  async runAllTests() {
    console.log("🚀 Starting Request Logging & Metrics Tests...\n");

    await this.runTest("MetricsTracker: unit behavior", () =>
      this.testMetricsTrackerUnit()
    );

    await this.setupTestEnvironment();

    try {
      await this.runTest("GET /metrics: Response shape", () =>
        this.testMetricsEndpointShape()
      );
      await this.runTest("Metrics: totalRequests increases", () =>
        this.testTotalsIncrease()
      );
      await this.runTest("Metrics: /metrics itself excluded", () =>
        this.testMetricsRouteExcluded()
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
        "\n🌟 Great job! Your metrics middleware implementation is working correctly!"
      );
      console.log("💡 Try implementing the bonus features:");
      console.log("   - Track min/max response time");
      console.log("   - Track per-route statistics");
      console.log("   - Add a rolling window average");
    } else {
      console.log("\n💡 Implementation Tips:");
      console.log("   - Implement MetricsTracker.record and getSnapshot first");
      console.log("   - Then wire up the metrics middleware globally");
      console.log("   - Finally implement the GET /metrics route");
    }
  }
}

async function runTests() {
  try {
    const tester = new MetricsTester();
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
    console.log(
      "\n💡 Make sure you have implemented the metrics middleware and routes in task-05.js"
    );
  }
}

if (require.main === module) {
  console.log("🧪 Request Logging & Metrics Test Suite");
  console.log("=========================================\n");
  runTests();
}

module.exports = { MetricsTester, runTests };
