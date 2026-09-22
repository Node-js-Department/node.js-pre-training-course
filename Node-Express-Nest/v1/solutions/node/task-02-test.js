/**
 * Test suite for Task 02 - File Stream Transformer
 * Run this after implementing your CSV processing functionality
 */

const fs = require("fs");
const path = require("path");
const {
  CSVParser,
  DataTransformer,
  CSVWriter,
  processCSVFile,
  capitalizeName,
  normalizeEmail,
  formatPhone,
  standardizeDate,
  createSampleData,
} = require("./task-02");

class StreamTransformerTester {
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
  setupTestEnvironment() {
    // Create test data directory
    if (!fs.existsSync(this.testDataDir)) {
      fs.mkdirSync(this.testDataDir, { recursive: true });
    }

    // Create sample CSV file
    const sampleCSV = `name,email,phone,birthdate,city
john doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york
jane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles
bob johnson,BOB@TEST.COM,invalid-phone,03/22/1992,chicago
alice brown,alice.brown@company.org,9876543210,1988/07/04,houston`;

    fs.writeFileSync(path.join(this.testDataDir, "input.csv"), sampleCSV);
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
   * Test: capitalizeName function
   */
  testCapitalizeName() {
    const testCases = [
      { input: "john doe", expected: "John Doe" },
      { input: "mary-jane smith", expected: "Mary-Jane Smith" },
      { input: "ALICE BROWN", expected: "Alice Brown" },
      { input: "jean-claude van damme", expected: "Jean-Claude Van Damme" },
      { input: "", expected: "" },
      { input: "a", expected: "A" },
    ];

    for (const testCase of testCases) {
      const result = capitalizeName(testCase.input);
      if (result !== testCase.expected) {
        throw new Error(
          `Expected "${testCase.expected}", got "${result}" for input "${testCase.input}"`
        );
      }
    }
  }

  /**
   * Test: normalizeEmail function
   */
  testNormalizeEmail() {
    const testCases = [
      { input: "JOHN.DOE@EXAMPLE.COM", expected: "john.doe@example.com" },
      { input: "Jane.Smith@Gmail.Com", expected: "jane.smith@gmail.com" },
      { input: "invalid-email", expected: "invalid-email" }, // Should return original
      { input: "test@", expected: "test@" }, // Should return original
      { input: "@test.com", expected: "@test.com" }, // Should return original
      { input: "valid@test.com", expected: "valid@test.com" },
    ];

    for (const testCase of testCases) {
      const result = normalizeEmail(testCase.input);
      if (result !== testCase.expected) {
        throw new Error(
          `Expected "${testCase.expected}", got "${result}" for input "${testCase.input}"`
        );
      }
    }
  }

  /**
   * Test: formatPhone function
   */
  testFormatPhone() {
    const testCases = [
      { input: "1234567890", expected: "(123) 456-7890" },
      { input: "555-123-4567", expected: "(555) 123-4567" },
      { input: "(987) 654-3210", expected: "(987) 654-3210" },
      { input: "invalid-phone", expected: "INVALID" },
      { input: "123", expected: "INVALID" },
      { input: "12345678901", expected: "INVALID" }, // Too many digits
      { input: "9876543210", expected: "(987) 654-3210" },
    ];

    for (const testCase of testCases) {
      const result = formatPhone(testCase.input);
      if (result !== testCase.expected) {
        throw new Error(
          `Expected "${testCase.expected}", got "${result}" for input "${testCase.input}"`
        );
      }
    }
  }

  /**
   * Test: standardizeDate function
   */
  testStandardizeDate() {
    const testCases = [
      { input: "12/25/1990", expected: "1990-12-25" },
      { input: "1985-03-15", expected: "1985-03-15" },
      { input: "1988/07/04", expected: "1988-07-04" },
      { input: "03/22/1992", expected: "1992-03-22" },
      { input: "invalid-date", expected: "invalid-date" }, // Should return original
      { input: "13/45/2000", expected: "13/45/2000" }, // Invalid date, return original
      { input: "2020-02-29", expected: "2020-02-29" }, // Valid leap year
    ];

    for (const testCase of testCases) {
      const result = standardizeDate(testCase.input);
      if (result !== testCase.expected) {
        throw new Error(
          `Expected "${testCase.expected}", got "${result}" for input "${testCase.input}"`
        );
      }
    }
  }

  /**
   * Test: CSVParser class
   */
  async testCSVParser() {
    const { Readable } = require("stream");

    const csvData =
      "name,email\njohn doe,john@test.com\njane smith,jane@test.com";
    const parser = new CSVParser();
    const results = [];

    return new Promise((resolve, reject) => {
      parser.on("data", (data) => {
        results.push(data);
      });

      parser.on("end", () => {
        try {
          if (results.length !== 2) {
            throw new Error(`Expected 2 records, got ${results.length}`);
          }

          if (!results[0].name || !results[0].email) {
            throw new Error("Records should have name and email properties");
          }

          if (results[0].name !== "john doe") {
            throw new Error(
              `Expected name "john doe", got "${results[0].name}"`
            );
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      });

      parser.on("error", reject);

      // Write test data
      parser.write(csvData);
      parser.end();
    });
  }

  /**
   * Test: DataTransformer class
   */
  async testDataTransformer() {
    const transformer = new DataTransformer();
    const testRecord = {
      name: "john doe",
      email: "JOHN@TEST.COM",
      phone: "1234567890",
      birthdate: "12/25/1990",
      city: "new york",
    };

    return new Promise((resolve, reject) => {
      let received = false;

      // Fail fast instead of hanging silently: if this test's promise never
      // settles (e.g. _transform() never push()es while incomplete), an
      // idle event loop can let the whole process exit early with no error,
      // silently skipping every test after this one. Ten seconds is a
      // generous ceiling for an in-memory, object-mode transform.
      const timer = setTimeout(() => {
        reject(new Error("Timed out waiting for a transformed record (did _transform() call push()?)"));
      }, 10000);

      transformer.on("data", (transformed) => {
        received = true;
        try {
          if (transformed.name !== "John Doe") {
            throw new Error(
              `Expected name "John Doe", got "${transformed.name}"`
            );
          }

          if (transformed.email !== "john@test.com") {
            throw new Error(
              `Expected email "john@test.com", got "${transformed.email}"`
            );
          }

          if (transformed.phone !== "(123) 456-7890") {
            throw new Error(
              `Expected phone "(123) 456-7890", got "${transformed.phone}"`
            );
          }

          if (transformed.birthdate !== "1990-12-25") {
            throw new Error(
              `Expected birthdate "1990-12-25", got "${transformed.birthdate}"`
            );
          }

          clearTimeout(timer);
          resolve();
        } catch (error) {
          clearTimeout(timer);
          reject(error);
        }
      });

      transformer.on("end", () => {
        if (!received) {
          clearTimeout(timer);
          reject(new Error("Stream ended without emitting any transformed record"));
        }
      });

      transformer.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });

      transformer.write(testRecord);
      transformer.end();
    });
  }

  /**
   * Test: CSVWriter class
   */
  async testCSVWriter() {
    const writer = new CSVWriter();
    const results = [];

    const testRecords = [
      { name: "John Doe", email: "john@test.com" },
      { name: "Jane Smith", email: "jane@test.com" },
    ];

    return new Promise((resolve, reject) => {
      writer.on("data", (data) => {
        results.push(data);
      });

      writer.on("end", () => {
        try {
          if (results.length < 2) {
            throw new Error("Should output headers and at least one data row");
          }

          // Check if first line contains headers
          const firstLine = results[0];
          if (typeof firstLine !== "string" || !firstLine.includes("name")) {
            throw new Error("First line should contain CSV headers");
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      });

      writer.on("error", reject);

      // Write test records
      testRecords.forEach((record) => writer.write(record));
      writer.end();
    });
  }

  /**
   * Test: Full file processing
   */
  async testFullProcessing() {
    const inputPath = path.join(this.testDataDir, "input.csv");
    const outputPath = path.join(this.testDataDir, "output.csv");

    // Run the processing
    await processCSVFile(inputPath, outputPath);

    // Verify output file exists
    if (!fs.existsSync(outputPath)) {
      throw new Error("Output file was not created");
    }

    // Read and verify output content
    const outputContent = fs.readFileSync(outputPath, "utf-8");
    const lines = outputContent.trim().split("\n");

    if (lines.length < 5) {
      // Header + 4 data rows
      throw new Error(
        `Expected at least 5 lines in output, got ${lines.length}`
      );
    }

    // Check header
    if (!lines[0].includes("name,email,phone,birthdate,city")) {
      throw new Error("Header line should contain expected columns");
    }

    // Check first data row (John Doe)
    const johnDoeRow = lines[1];
    if (!johnDoeRow.includes("John Doe")) {
      throw new Error("First data row should contain capitalized 'John Doe'");
    }

    if (!johnDoeRow.includes("john.doe@example.com")) {
      throw new Error("First data row should contain normalized email");
    }

    if (!johnDoeRow.includes("(123) 456-7890")) {
      throw new Error("First data row should contain formatted phone number");
    }

    if (!johnDoeRow.includes("1990-12-25")) {
      throw new Error("First data row should contain standardized date");
    }

    // Check row with invalid phone (Bob Johnson)
    const bobRow = lines[3];
    if (!bobRow.includes("INVALID")) {
      throw new Error("Bob Johnson row should contain 'INVALID' for phone");
    }
  }

  /**
   * Test: Error handling
   */
  async testErrorHandling() {
    // Test with non-existent input file
    const nonExistentInput = path.join(this.testDataDir, "nonexistent.csv");
    const outputPath = path.join(this.testDataDir, "error-output.csv");

    try {
      await processCSVFile(nonExistentInput, outputPath);
      throw new Error("Should have thrown an error for non-existent file");
    } catch (error) {
      if (!error.message.includes("Failed to process CSV file")) {
        throw new Error(
          "Error should be properly wrapped with descriptive message"
        );
      }
    }
  }

  /**
   * Test: Sample data creation
   */
  testSampleDataCreation() {
    createSampleData();

    // Check if data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      throw new Error("Data directory should be created");
    }

    // Check if sample CSV file exists
    const sampleFile = path.join(dataDir, "users.csv");
    if (!fs.existsSync(sampleFile)) {
      throw new Error("Sample CSV file should be created");
    }

    // Verify content
    const content = fs.readFileSync(sampleFile, "utf-8");
    if (!content.includes("john doe") || !content.includes("jane smith")) {
      throw new Error("Sample CSV should contain expected test data");
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log("🚀 Starting Stream Transformer Tests...\n");

    // Setup test environment
    this.setupTestEnvironment();

    try {
      await this.runTest("Helper: capitalizeName function", () =>
        this.testCapitalizeName()
      );
      await this.runTest("Helper: normalizeEmail function", () =>
        this.testNormalizeEmail()
      );
      await this.runTest("Helper: formatPhone function", () =>
        this.testFormatPhone()
      );
      await this.runTest("Helper: standardizeDate function", () =>
        this.testStandardizeDate()
      );
      await this.runTest("Stream: CSVParser class", () => this.testCSVParser());
      await this.runTest("Stream: DataTransformer class", () =>
        this.testDataTransformer()
      );
      await this.runTest("Stream: CSVWriter class", () => this.testCSVWriter());
      await this.runTest("Integration: Full file processing", () =>
        this.testFullProcessing()
      );
      await this.runTest("Error handling: Invalid input", () =>
        this.testErrorHandling()
      );
      await this.runTest("Utility: Sample data creation", () =>
        this.testSampleDataCreation()
      );

      this.printResults();
    } finally {
      // Cleanup test environment
      this.cleanupTestEnvironment();
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
        "\n🌟 Great job! Your Stream Transformer implementation is working correctly!"
      );
      console.log("💡 Try implementing the bonus features:");
      console.log("   - Progress reporting for large files");
      console.log("   - Support for different CSV delimiters");
      console.log("   - Data validation with detailed error reporting");
      console.log("   - CLI tool for transformations");
      console.log("   - Multiple transformation rules");
    }
  }
}

/**
 * Main test execution
 */
async function runTests() {
  try {
    const tester = new StreamTransformerTester();
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
    console.log(
      "\n💡 Make sure you have implemented all required functionality in task-02.js"
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  console.log("🧪 Stream Transformer Test Suite");
  console.log("=================================\n");
  runTests();
}

module.exports = { StreamTransformerTester, runTests };
