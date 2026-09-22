/**
 * Test suite for Task 01 - Custom Event Emitter
 * Run this after implementing your MessageSystem to verify functionality
 */

const MessageSystem = require("./task-01");

class MessageSystemTester {
  constructor() {
    this.testResults = [];
    this.messenger = new MessageSystem();
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
   * Test: sendMessage method
   */
  testSendMessage() {
    let messageReceived = null;

    // Listen for messages
    this.messenger.subscribeToMessages((message) => {
      messageReceived = message;
    });

    const result = this.messenger.sendMessage(
      "message",
      "Test message",
      "TestUser"
    );

    if (!result || typeof result !== "object") {
      throw new Error("sendMessage should return a message object");
    }

    if (
      !result.id ||
      !result.type ||
      !result.content ||
      !result.timestamp ||
      !result.sender
    ) {
      throw new Error(
        "Message object should have id, type, content, timestamp, and sender"
      );
    }

    if (result.type !== "message") {
      throw new Error("Message type should match the input");
    }

    if (result.content !== "Test message") {
      throw new Error("Message content should match the input");
    }

    if (result.sender !== "TestUser") {
      throw new Error("Message sender should match the input");
    }

    // Check if event was emitted
    if (!messageReceived) {
      throw new Error("Message event should be emitted");
    }

    if (messageReceived.id !== result.id) {
      throw new Error("Emitted message should match returned message");
    }
  }

  /**
   * Test: subscribeToType method
   */
  testSubscribeToType() {
    let alertReceived = null;
    let messageReceived = null;

    // Subscribe to alerts only
    this.messenger.subscribeToType("alert", (message) => {
      alertReceived = message;
    });

    // Subscribe to all messages
    this.messenger.subscribeToMessages((message) => {
      messageReceived = message;
    });

    // Send an alert
    this.messenger.sendMessage("alert", "Test alert", "System");

    if (!alertReceived) {
      throw new Error(
        "Alert-specific subscription should receive alert messages"
      );
    }

    if (!messageReceived) {
      throw new Error("General subscription should receive all messages");
    }

    if (alertReceived.type !== "alert") {
      throw new Error("Alert message should have correct type");
    }
  }

  /**
   * Test: addUser method
   */
  testAddUser() {
    let userJoinedReceived = null;

    this.messenger.subscribeToType("user-joined", (message) => {
      userJoinedReceived = message;
    });

    this.messenger.addUser("Alice");

    if (this.messenger.getUserCount() !== 1) {
      throw new Error("User count should increase after adding user");
    }

    if (!this.messenger.getActiveUsers().includes("Alice")) {
      throw new Error("Active users should include added user");
    }

    if (!userJoinedReceived) {
      throw new Error("user-joined event should be emitted");
    }

    if (!userJoinedReceived.content.includes("Alice")) {
      throw new Error("user-joined message should mention the username");
    }

    // Test duplicate user
    this.messenger.addUser("Alice");
    if (this.messenger.getUserCount() !== 1) {
      throw new Error("Adding duplicate user should not increase count");
    }
  }

  /**
   * Test: removeUser method
   */
  testRemoveUser() {
    let userLeftReceived = null;

    this.messenger.subscribeToType("user-left", (message) => {
      userLeftReceived = message;
    });

    // Add user first
    this.messenger.addUser("Bob");
    const initialCount = this.messenger.getUserCount();

    // Remove user
    this.messenger.removeUser("Bob");

    if (this.messenger.getUserCount() !== initialCount - 1) {
      throw new Error("User count should decrease after removing user");
    }

    if (this.messenger.getActiveUsers().includes("Bob")) {
      throw new Error("Active users should not include removed user");
    }

    if (!userLeftReceived) {
      throw new Error("user-left event should be emitted");
    }

    if (!userLeftReceived.content.includes("Bob")) {
      throw new Error("user-left message should mention the username");
    }
  }

  /**
   * Test: getMessageHistory method
   */
  testGetMessageHistory() {
    // Clear existing messages
    this.messenger.clearHistory();

    // Send some messages
    this.messenger.sendMessage("message", "Message 1");
    this.messenger.sendMessage("message", "Message 2");
    this.messenger.sendMessage("message", "Message 3");

    const history = this.messenger.getMessageHistory();

    if (!Array.isArray(history)) {
      throw new Error("getMessageHistory should return an array");
    }

    if (history.length === 0) {
      throw new Error("Message history should contain sent messages");
    }

    // Test with count parameter
    const limitedHistory = this.messenger.getMessageHistory(2);
    if (limitedHistory.length > 2) {
      throw new Error("getMessageHistory should respect count parameter");
    }
  }

  /**
   * Test: getStats method
   */
  testGetStats() {
    const stats = this.messenger.getStats();

    if (!stats || typeof stats !== "object") {
      throw new Error("getStats should return an object");
    }

    if (typeof stats.totalMessages !== "number") {
      throw new Error("Stats should include totalMessages as number");
    }

    if (typeof stats.activeUsers !== "number") {
      throw new Error("Stats should include activeUsers as number");
    }

    if (!stats.messagesByType || typeof stats.messagesByType !== "object") {
      throw new Error("Stats should include messagesByType as object");
    }
  }

  /**
   * Test: Message persistence (last 100 messages)
   */
  testMessagePersistence() {
    // Clear messages first
    this.messenger.clearHistory();

    // Send 105 messages to test the 100 message limit
    for (let i = 1; i <= 105; i++) {
      this.messenger.sendMessage("message", `Message ${i}`);
    }

    const history = this.messenger.getMessageHistory(200); // Request more than available

    if (history.length > 100) {
      throw new Error("Should not store more than 100 messages");
    }

    // Check that older messages were removed
    const hasFirstMessage = history.some((msg) => msg.content === "Message 1");
    if (hasFirstMessage) {
      throw new Error("Oldest messages should be removed when exceeding 100");
    }

    // Check that recent messages are kept
    const hasRecentMessage = history.some(
      (msg) => msg.content === "Message 105"
    );
    if (!hasRecentMessage) {
      throw new Error("Recent messages should be kept");
    }
  }

  /**
   * Test: Multiple listeners for same event
   */
  testMultipleListeners() {
    let listener1Called = false;
    let listener2Called = false;

    this.messenger.subscribeToMessages(() => {
      listener1Called = true;
    });

    this.messenger.subscribeToMessages(() => {
      listener2Called = true;
    });

    this.messenger.sendMessage("message", "Test multiple listeners");

    if (!listener1Called || !listener2Called) {
      throw new Error("All listeners should be called for the same event");
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log("🚀 Starting MessageSystem Tests...\n");

    await this.runTest("sendMessage - basic functionality", () =>
      this.testSendMessage()
    );
    await this.runTest("subscribeToType - specific event subscription", () =>
      this.testSubscribeToType()
    );
    await this.runTest("addUser - user management", () => this.testAddUser());
    await this.runTest("removeUser - user removal", () =>
      this.testRemoveUser()
    );
    await this.runTest("getMessageHistory - message retrieval", () =>
      this.testGetMessageHistory()
    );
    await this.runTest("getStats - statistics generation", () =>
      this.testGetStats()
    );
    await this.runTest("Message persistence - 100 message limit", () =>
      this.testMessagePersistence()
    );
    await this.runTest("Multiple listeners - event broadcasting", () =>
      this.testMultipleListeners()
    );

    this.printResults();
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
        "\n🌟 Great job! Your MessageSystem implementation is working correctly!"
      );
      console.log("💡 Try implementing the bonus features:");
      console.log("   - Message persistence (save to file)");
      console.log("   - Message filtering/search");
      console.log("   - Rate limiting for message sending");
      console.log("   - Different user roles with permissions");
    }
  }
}

/**
 * Main test execution
 */
async function runTests() {
  try {
    const tester = new MessageSystemTester();
    await tester.runAllTests();
  } catch (error) {
    console.error("❌ Test setup failed:", error.message);
    console.log(
      "\n💡 Make sure you have implemented all required methods in task-01.js"
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  console.log("🧪 MessageSystem Test Suite");
  console.log("============================\n");
  runTests();
}

module.exports = { MessageSystemTester, runTests };
