import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { DiChainModule } from "./di-chain.module";
import { LoggerService } from "./logger.service";
import { UserService, User } from "./user.service";
import { AuditService } from "./audit.service";

/**
 * Task 02 - Dependency Injection Chain
 *
 * Two kinds of tests here, matching the task brief:
 *
 * 1. An integration-style test that wires the real chain
 *    (AuditService -> UserService -> LoggerService) through
 *    `DiChainModule` and exercises it end-to-end.
 * 2. A unit test that replaces `UserService` with a mock provider so
 *    `AuditService` can be tested completely in isolation - this is
 *    the "testing with mocks" part of constructor-based DI.
 */
describe("Task 02 - Dependency Injection Chain", () => {
  describe("real chain via DiChainModule", () => {
    let moduleRef: TestingModule;

    beforeEach(async () => {
      moduleRef = await Test.createTestingModule({
        imports: [DiChainModule],
      }).compile();
    });

    it("resolves LoggerService, UserService and AuditService from the module", () => {
      expect(moduleRef.get(LoggerService, { strict: false })).toBeInstanceOf(
        LoggerService,
      );
      expect(moduleRef.get(UserService, { strict: false })).toBeInstanceOf(
        UserService,
      );
      expect(moduleRef.get(AuditService, { strict: false })).toBeInstanceOf(
        AuditService,
      );
    });

    it("records an audit entry for a real user created via UserService", () => {
      const userService = moduleRef.get(UserService, { strict: false });
      const auditService = moduleRef.get(AuditService, { strict: false });

      const user: User = userService.createUser("Ada Lovelace", "ada@example.com");
      const entry = auditService.recordAction(user.id, "USER_CREATED");

      expect(entry.userId).toBe(user.id);
      expect(auditService.getLogForUser(user.id)).toHaveLength(1);
    });

    it("throws when recording an action for a user that does not exist", () => {
      const auditService = moduleRef.get(AuditService, { strict: false });
      expect(() => auditService.recordAction(9999, "USER_CREATED")).toThrow();
    });
  });

  describe("AuditService in isolation with a mocked UserService", () => {
    it("never touches the real UserService/LoggerService implementation", async () => {
      const mockUserService: Partial<UserService> = {
        findById: jest.fn().mockReturnValue({
          id: 1,
          name: "Mock User",
          email: "mock@example.com",
        }),
      };

      const moduleRef = await Test.createTestingModule({
        providers: [
          AuditService,
          { provide: UserService, useValue: mockUserService },
        ],
      }).compile();

      const auditService = moduleRef.get(AuditService);
      const entry = auditService.recordAction(1, "LOGIN");

      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(entry.action).toBe("LOGIN");
    });
  });
});
