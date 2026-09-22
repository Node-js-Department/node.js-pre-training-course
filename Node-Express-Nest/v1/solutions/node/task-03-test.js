/**
 * STRICT Test suite for Task 03 - Event Loop Analysis & Async Debugging
 * This test suite actually validates that the implementation works correctly
 * Run this after implementing your event loop and async debugging functionality
 */

const fs = require("fs");
const path = require("path");
const {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
} = require("./task-03");

class StrictEventLoopTester {
  constructor() {
    this.testResults = [];
    this.testDataDir = path.join(__dirname, "test-data");
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
    // Create test data directory
    if (!fs.existsSync(this.testDataDir)) {
      fs.mkdirSync(this.testDataDir, { recursive: true });
    }

    // Create sample test files with realistic data
    const testFiles = {
      "user-123.json": JSON.stringify({
        id: 123,
        name: "Test User",
        email: "test@example.com",
      }),
      "preferences-123.json": JSON.stringify({
        theme: "dark",
        language: "en",
        notifications: true,
      }),
      "activity-123.json": JSON.stringify({
        lastLogin: "2025-01-01",
        sessionsCount: 15,
        totalTime: 3600,
      }),
      "input.txt": "Hello World Test Data for Processing",
      "file1.txt": "Content of file 1 - Processing Data",
      "file2.txt": "Content of file 2 - More Data",
      "file3.txt": "Content of file 3 - Final Data",
    };

    for (const [filename, content] of Object.entries(testFiles)) {
      fs.writeFileSync(path.join(this.testDataDir, filename), content);
    }
  }

  /**
   * Cleanup test environment
   */
  cleanupTestEnvironment() {
    try {
      if (fs.existsSync(this.testDataDir)) {
        fs.rmSync(this.testDataDir, { recursive: true, force: true });
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  /**
   * STRICT Test: analyzeEventLoop function must actually analyze event loop
   */
  testAnalyzeEventLoop() {
    const analysis = analyzeEventLoop();

    if (!analysis || typeof analysis !== "object") {
      throw new Error("analyzeEventLoop should return an object");
    }

    // Check that phases array contains actual event loop phases
    if (!Array.isArray(analysis.phases) || analysis.phases.length === 0) {
      throw new Error(
        "Analysis must include non-empty phases array with actual event loop phases"
      );
    }

    // Verify it contains known event loop phases
    const expectedPhases = [
      "timers",
      "pending callbacks",
      "poll",
      "check",
      "close callbacks",
    ];
    const hasValidPhases = expectedPhases.some((phase) =>
      analysis.phases.some(
        (p) =>
          typeof p === "string" && p.toLowerCase().includes(phase.split(" ")[0])
      )
    );

    if (!hasValidPhases) {
      throw new Error(
        "Analysis phases must include actual Node.js event loop phases (timers, poll, check, etc.)"
      );
    }

    // Check execution order is populated
    if (
      !Array.isArray(analysis.executionOrder) ||
      analysis.executionOrder.length === 0
    ) {
      throw new Error(
        "Analysis must include non-empty executionOrder array showing actual execution sequence"
      );
    }

    // Check explanations exist
    if (
      !Array.isArray(analysis.explanations) ||
      analysis.explanations.length === 0
    ) {
      throw new Error(
        "Analysis must include non-empty explanations array with actual explanations"
      );
    }

    // Verify explanations contain actual content
    const hasRealExplanations = analysis.explanations.some(
      (exp) =>
        typeof exp === "string" &&
        exp.length > 10 &&
        (exp.includes("microtask") ||
          exp.includes("macrotask") ||
          exp.includes("event loop"))
    );

    if (!hasRealExplanations) {
      throw new Error(
        "Explanations must contain actual event loop concepts (microtask, macrotask, etc.)"
      );
    }
  }

  /**
   * STRICT Test: predictExecutionOrder must return realistic predictions
   */
  testPredictExecutionOrder() {
    const prediction1 = predictExecutionOrder("snippet1");
    const prediction2 = predictExecutionOrder("snippet2");

    // Test snippet1 predictions
    if (!Array.isArray(prediction1) || prediction1.length === 0) {
      throw new Error(
        "predictExecutionOrder('snippet1') must return non-empty array with actual predictions"
      );
    }

    // Check that predictions contain realistic execution steps
    const hasRealisticPredictions1 = prediction1.some(
      (pred) => typeof pred === "string" && pred.length > 5
    );

    if (!hasRealisticPredictions1) {
      throw new Error(
        "snippet1 predictions must contain realistic execution order descriptions"
      );
    }

    // Test snippet2 predictions
    if (!Array.isArray(prediction2) || prediction2.length === 0) {
      throw new Error(
        "predictExecutionOrder('snippet2') must return non-empty array with actual predictions"
      );
    }

    const hasRealisticPredictions2 = prediction2.some(
      (pred) => typeof pred === "string" && pred.length > 5
    );

    if (!hasRealisticPredictions2) {
      throw new Error(
        "snippet2 predictions must contain realistic execution order descriptions"
      );
    }

    // Test with invalid snippet should still return array (but can be empty)
    const invalidPrediction = predictExecutionOrder("invalid");
    if (!Array.isArray(invalidPrediction)) {
      throw new Error(
        "predictExecutionOrder should return array even for invalid snippet"
      );
    }
  }

  /**
   * STRICT Test: fixRaceCondition must actually process files
   */
  async testFixRaceCondition() {
    const originalCwd = process.cwd();
    process.chdir(this.testDataDir);

    try {
      const result = await fixRaceCondition();

      if (!Array.isArray(result)) {
        throw new Error("fixRaceCondition must return an array");
      }

      // If implementation is complete, it should return processed file contents
      if (result.length === 0) {
        throw new Error(
          "fixRaceCondition must actually process files and return results (currently returns empty array - implementation needed)"
        );
      }

      // Check that results contain actual file processing results
      const hasRealResults = result.some(
        (item) =>
          typeof item === "string" ||
          (typeof item === "object" && item !== null)
      );

      if (!hasRealResults) {
        throw new Error(
          "fixRaceCondition results must contain actual processed file data"
        );
      }
    } finally {
      process.chdir(originalCwd);
    }
  }

  /**
   * STRICT Test: fixCallbackHell must actually read and process user data
   */
  async testFixCallbackHell() {
    const originalCwd = process.cwd();
    process.chdir(this.testDataDir);

    try {
      const result = await fixCallbackHell(123);

      // Should return processed user data when files exist
      if (result === null) {
        throw new Error(
          "fixCallbackHell must return processed user data when files exist (currently returns null - implementation needed)"
        );
      }

      if (typeof result !== "object") {
        throw new Error(
          "fixCallbackHell must return an object with combined user data"
        );
      }

      // Check that result contains combined data from all three files
      const hasUserData =
        result.hasOwnProperty("id") || result.hasOwnProperty("user");
      const hasPreferences =
        result.hasOwnProperty("theme") || result.hasOwnProperty("preferences");
      const hasActivity =
        result.hasOwnProperty("lastLogin") || result.hasOwnProperty("activity");

      if (!hasUserData || !hasPreferences || !hasActivity) {
        throw new Error(
          "fixCallbackHell must combine data from user, preferences, and activity files"
        );
      }
    } finally {
      process.chdir(originalCwd);
    }
  }

  /**
   * STRICT Test: fixMixedAsync must actually perform async operations
   */
  async testFixMixedAsync() {
    const originalCwd = process.cwd();
    process.chdir(this.testDataDir);

    try {
      // Capture console output to verify actual work is done
      const originalLog = console.log;
      let logOutput = "";
      console.log = (message) => {
        logOutput += message + "\n";
      };

      await fixMixedAsync();

      console.log = originalLog;

      // Should have performed some actual work (logged something other than "not implemented")
      if (
        logOutput.includes("not implemented") ||
        logOutput.trim().length === 0
      ) {
        throw new Error(
          "fixMixedAsync must perform actual async operations (currently shows 'not implemented')"
        );
      }

      // Should show evidence of async processing
      const hasAsyncEvidence =
        logOutput.includes("processing") ||
        logOutput.includes("completed") ||
        logOutput.includes("result");

      if (!hasAsyncEvidence) {
        throw new Error(
          "fixMixedAsync must show evidence of actual async processing work"
        );
      }
    } finally {
      process.chdir(originalCwd);
    }
  }

  /**
   * STRICT Test: demonstrateEventLoop must actually demonstrate event loop phases
   */
  async testDemonstrateEventLoop() {
    // Capture console output
    const originalLog = console.log;
    let logOutput = "";
    console.log = (message) => {
      logOutput += message + "\n";
    };

    try {
      await demonstrateEventLoop();

      console.log = originalLog;

      // Should have demonstrated actual event loop phases
      if (
        logOutput.includes("not implemented") ||
        logOutput.trim().length === 0
      ) {
        throw new Error(
          "demonstrateEventLoop must actually demonstrate event loop phases (currently shows 'not implemented')"
        );
      }

      // Should show evidence of different event loop phases
      const hasEventLoopTerms =
        logOutput.includes("timer") ||
        logOutput.includes("immediate") ||
        logOutput.includes("nextTick") ||
        logOutput.includes("promise") ||
        logOutput.includes("phase");

      if (!hasEventLoopTerms) {
        throw new Error(
          "demonstrateEventLoop must show actual event loop phases (timers, immediate, nextTick, promises)"
        );
      }
    } finally {
      console.log = originalLog;
    }
  }

  /**
   * STRICT Test: createTestFiles must actually create files
   */
  async testCreateTestFiles() {
    const testDir = path.join(this.testDataDir, "created-files");
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const originalCwd = process.cwd();
    process.chdir(testDir);

    try {
      // Count files before
      const filesBefore = fs.readdirSync(testDir).length;

      await createTestFiles();

      // Count files after
      const filesAfter = fs.readdirSync(testDir).length;

      if (filesAfter <= filesBefore) {
        throw new Error(
          "createTestFiles must actually create test files (no new files detected - implementation needed)"
        );
      }

      // Verify at least some expected files were created
      const createdFiles = fs.readdirSync(testDir);
      const hasExpectedFiles = createdFiles.some(
        (file) =>
          file.includes("user") ||
          file.includes("file") ||
          file.includes("input")
      );

      if (!hasExpectedFiles) {
        throw new Error(
          "createTestFiles must create expected test files (user-*.json, file*.txt, etc.)"
        );
      }
    } finally {
      process.chdir(originalCwd);
    }
  }

  /**
   * STRICT Test: logWithPhase must provide enhanced logging
   */
  testLogWithPhase() {
    // Capture console output
    const originalLog = console.log;
    let logOutput = "";
    console.log = (message) => {
      logOutput += message + "\n";
    };

    try {
      logWithPhase("Test message", "timers");

      if (!logOutput.includes("Test message")) {
        throw new Error("logWithPhase must include the message");
      }

      if (!logOutput.includes("timers")) {
        throw new Error("logWithPhase must include the phase");
      }

      // Check for enhanced logging features - STRICT requirements
      const hasBasicBrackets =
        logOutput.includes("[") && logOutput.includes("]");

      if (!hasBasicBrackets) {
        throw new Error(
          "logWithPhase must provide basic formatting with brackets"
        );
      }

      // Check for timestamp (should include time/date info)
      const hasTimestamp =
        /\d{2}:\d{2}|\d{4}-\d{2}-\d{2}|\d+ms|T\d{2}:|Date|Time/i.test(
          logOutput
        );

      if (!hasTimestamp) {
        throw new Error(
          "logWithPhase must include timestamp information (time, date, or duration)"
        );
      }

      // Check for enhanced formatting beyond basic brackets
      const hasEnhancedFormatting =
        logOutput.includes("🕐") ||
        logOutput.includes("⏰") ||
        logOutput.includes(">>>") ||
        logOutput.includes("Phase:") ||
        logOutput.includes("|") ||
        logOutput.match(/\d{2}:\d{2}:\d{2}/) ||
        logOutput.includes("ms") ||
        logOutput.length > 30; // Should be more than just "[phase] message"

      if (!hasEnhancedFormatting) {
        throw new Error(
          "logWithPhase must provide enhanced formatting beyond basic brackets (timestamps, colors, detailed formatting, etc.)"
        );
      }
    } finally {
      console.log = originalLog;
    }
  }

  /**
   * STRICT Test: Event loop phase understanding (tests student's analysis, not Node.js itself)
   */
  testEventLoopPhaseUnderstanding() {
    // Test that the student can predict execution order correctly
    const analysis = analyzeEventLoop();

    if (!analysis || typeof analysis !== "object") {
      throw new Error(
        "Event loop understanding test requires analyzeEventLoop to return analysis object"
      );
    }

    // Check if student's analysis demonstrates understanding
    if (
      !Array.isArray(analysis.executionOrder) ||
      analysis.executionOrder.length === 0
    ) {
      throw new Error(
        "Event loop understanding requires executionOrder analysis (not just Node.js execution)"
      );
    }

    // Test prediction capability
    const prediction1 = predictExecutionOrder("snippet1");

    if (!Array.isArray(prediction1) || prediction1.length === 0) {
      throw new Error(
        "Event loop understanding requires predictExecutionOrder to work for snippet1"
      );
    }

    // Check that predictions show understanding of event loop phases
    const executionOrderText = analysis.executionOrder.join(" ").toLowerCase();
    const predictionsText = prediction1.join(" ").toLowerCase();
    const combinedText = executionOrderText + " " + predictionsText;

    const showsEventLoopKnowledge =
      combinedText.includes("sync") ||
      combinedText.includes("microtask") ||
      combinedText.includes("macrotask") ||
      combinedText.includes("nexttick") ||
      combinedText.includes("timer") ||
      combinedText.includes("immediate") ||
      combinedText.includes("promise");

    if (!showsEventLoopKnowledge) {
      throw new Error(
        "Event loop understanding must demonstrate knowledge of execution phases (sync, microtask, macrotask, etc.)"
      );
    }

    // Additional check: verify explanations show understanding
    if (
      Array.isArray(analysis.explanations) &&
      analysis.explanations.length > 0
    ) {
      const explanationText = analysis.explanations.join(" ").toLowerCase();
      const hasDeepUnderstanding =
        explanationText.includes("microtask") &&
        (explanationText.includes("macrotask") ||
          explanationText.includes("timer")) &&
        explanationText.length > 50; // Should have substantial explanations

      if (!hasDeepUnderstanding) {
        throw new Error(
          "Event loop explanations must demonstrate deep understanding of microtasks vs macrotasks"
        );
      }
    }

    return Promise.resolve(); // Pass if all checks succeed
  }

  /**
   * Run all tests with strict validation
   */
  async runAllTests() {
    console.log("🚀 Starting STRICT Event Loop & Async Debugging Tests...\n");
    console.log(
      "⚠️  These tests require actual implementation - they will fail with TODO stubs!\n"
    );

    await this.setupTestEnvironment();

    try {
      await this.runTest(
        "Event Loop: analyzeEventLoop must analyze actual event loop",
        () => this.testAnalyzeEventLoop()
      );
      await this.runTest(
        "Event Loop: predictExecutionOrder must provide real predictions",
        () => this.testPredictExecutionOrder()
      );
      await this.runTest("Async Fix: fixRaceCondition must process files", () =>
        this.testFixRaceCondition()
      );
      await this.runTest(
        "Async Fix: fixCallbackHell must combine user data",
        () => this.testFixCallbackHell()
      );
      await this.runTest(
        "Async Fix: fixMixedAsync must perform async work",
        () => this.testFixMixedAsync()
      );
      await this.runTest(
        "Demo: demonstrateEventLoop must show actual phases",
        () => this.testDemonstrateEventLoop()
      );
      await this.runTest(
        "Utility: createTestFiles must create actual files",
        () => this.testCreateTestFiles()
      );
      await this.runTest("Utility: logWithPhase must enhance logging", () =>
        this.testLogWithPhase()
      );
      await this.runTest(
        "Understanding: Event loop phases execution order",
        () => this.testEventLoopPhaseUnderstanding()
      );

      this.printResults();
    } finally {
      this.cleanupTestEnvironment();
    }
  }

  /**
   * Print test results summary
   */
  printResults() {
    console.log("\n📊 STRICT Test Results:");
    console.log("========================");

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
      console.log("\n❌ Failed Tests (Implementation Required):");
      this.testResults
        .filter((r) => r.status === "FAIL")
        .forEach((r) => console.log(`  - ${r.name}:\n    ${r.error}`));

      console.log("\n💡 Next Steps:");
      console.log("   1. Replace TODO comments with actual implementation");
      console.log(
        "   2. Implement each function according to the task requirements"
      );
      console.log("   3. Run tests again to verify your implementation");
      console.log("   4. Use the basic test file for educational guidance");
    }

    if (failed === 0) {
      console.log("\n🎉 All STRICT tests passed!");
      console.log(
        "🌟 Excellent! Your Event Loop & Async Debugging implementation is fully working!"
      );
      console.log("\n💡 Advanced challenges:");
      console.log("   - Add performance monitoring to event loop analysis");
      console.log("   - Create visual timeline of async operations");
      console.log("   - Implement custom event loop debugger");
      console.log("   - Add memory usage tracking for async operations");
    } else {
      console.log("\n🔧 Keep working on your implementation!");
      console.log(
        "💭 Remember: The basic test file (task-03-test.js) provides guidance"
      );
      console.log(
        "⚡ This strict test validates that your code actually works"
      );
    }
  }
}

/**
 * Main test execution
 */
async function runStrictTests() {
  try {
    const tester = new StrictEventLoopTester();
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Strict test setup failed:", error.message);
    console.log(
      "\n💡 Make sure you have implemented all required functionality in task-03.js"
    );
    console.log(
      "🔍 These tests require actual working code, not just TODO comments"
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  console.log("🧪 STRICT Event Loop & Async Debugging Test Suite");
  console.log("==================================================");
  console.log("⚠️  WARNING: These tests require actual implementation!");
  console.log("📝 Use task-03-test.js for educational guidance");
  console.log("✅ Use this file to validate your final implementation\n");
  runStrictTests();
}

module.exports = { StrictEventLoopTester, runStrictTests };
