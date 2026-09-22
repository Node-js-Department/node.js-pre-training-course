# Test Commands

## Running All Tests
```bash
npm test
```

## Running Individual Test Files

### React CSS Tests
```bash
# React CSS tests are now in the separate react-todo-app project
cd React-CSS/react-todo-app
npm test
```

### Docker Git Tests
```bash
npm run test:docker-git
```

### JS TS Tests
```bash
npm run test:js-ts
```

### Node-Express-Nest Tests
```bash
# Node.js and Express.js tasks: each has its own self-running tester (no jest)
node Node-Express-Nest/v1/solutions/node/task-01-test.js
node Node-Express-Nest/v1/solutions/express/task-01-test.js
# ...through task-05 for each

# NestJS tasks: an isolated jest project with its own dependencies
cd Node-Express-Nest/v1/solutions/nest
npm install
npx jest
```

## Additional Commands

### Running Tests in Watch Mode
```bash
npm run test:watch
```

### Running Tests with Code Coverage
```bash
npm run test:coverage
```

## Command Descriptions

- `npm test` - runs all tests in the `tests/` folder
- React CSS tests - now in separate project at `React-CSS/react-todo-app`
- `npm run test:docker-git` - runs only Docker Git tests
- `npm run test:js-ts` - runs only JS TS tests
- `npm run test:watch` - runs tests in watch mode (automatically restarts when changes are detected)
- `npm run test:coverage` - runs tests with code coverage report generation

## Test Structure

Tests are located in the `tests/` folder:
- `docker-git.test.js` - tests for Docker Git
- `js-ts-task-01..10.test.ts` - tests for JS/TS (one file per task; task 9 has
  none by design - you write it yourself)

The DB module has no automated tests yet.

React CSS tests are now in the separate project at `React-CSS/react-todo-app/`

Node-Express-Nest tests live alongside each task's solution (see above) rather
than in the root `tests/` folder, and are not part of `npm test`.
