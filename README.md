# Pre-Internship ToDo Course: Guide

A comprehensive training course covering JavaScript/TypeScript, React, Node.js, databases, and DevOps. Each topic has its own dedicated project structure with tasks, solutions, and tests.

## Project Structure

```
node.js-pre-training-practice/
├── JS-TS/                    # JavaScript/TypeScript fundamentals
│   ├── tasks/               # Task descriptions
│   └── solutions/           # Your implementations
├── React-CSS/
│   └── react-todo-app/      # Complete React application with TypeScript
│       ├── src/solutions/   # React component implementations
│       ├── tasks/           # React task descriptions
│       └── src/__tests__/   # React component tests
├── Node-Express-Nest/       # Backend development
│   └── v1/
│       ├── tasks/           # Node.js, Express.js and NestJS tasks
│       │    ├── node/       # Node.js specific tasks
│       │    ├── express/    # Express.js tasks
│       │    └── nest/       # NestJS tasks
│       └── solutions/       # Backend implementations
│            ├── node/       # Node.js specific solutions
│            ├── express/    # Express.js solutions
│            └── nest/       # NestJS solutions
├── DB/                     # Database queries
│   ├── tasks/               # SQL and MongoDB tasks
│   └── solutions/           # Database solutions
├── Docker-Git/             # DevOps and version control
│   ├── tasks/               # Docker and Git tasks
│   └── solutions/           # Infrastructure solutions
└── tests/                  # Test files for all topics
```

## Recommended Learning Order

1. **JS-TS**: Start with JavaScript/TypeScript fundamentals

   - Basic data structures, functions, and ToDo logic
   - Complete all 10 tasks in `JS-TS/tasks/`

2. **React-CSS**: Build the frontend application

   - Navigate to `React-CSS/react-todo-app/`
   - Complete React component tasks with TypeScript
   - Run `npm start` to see your components in action
   - Run `npm test` to test your implementations

3. **Node-Express-Nest**: Backend development

   - Node.js tasks for core runtime concepts (events, streams, HTTP)
   - Express.js tasks for API endpoints
   - NestJS tasks for advanced backend patterns
   - Complete all 15 tasks (5 node + 5 express + 5 nest) in `Node-Express-Nest/v1/tasks/`

4. **DB**: Database operations

   - SQL queries for relational databases
   - MongoDB operations for NoSQL
   - Complete all 10 tasks in `DB/tasks/`

5. **Docker-Git**: DevOps and deployment
   - Containerization with Docker
   - Version control with Git
   - Complete all 10 tasks in `Docker-Git/tasks/`

## Testing Your Solutions

### Root Level Tests

```bash
# Test all topics
npm test

# Test specific topics
npm run test:js-ts
npm run test:docker-git
```

### React Application Tests

```bash
cd React-CSS/react-todo-app
npm test
```

## Working with Tasks

### General Approach

1. **Read the Task**: Open the corresponding `.mdx` file in the `tasks/` folder
2. **Implement Solution**: Create your solution in the `solutions/` folder
3. **Test Your Code**: Run the appropriate test command
4. **Iterate**: Fix issues and improve your solution

### React-Specific Workflow

1. **Study the Task**: Read the task description in `React-CSS/react-todo-app/tasks/`
2. **Implement Component**: Create your component in `src/solutions/`
3. **Test**: Run `npm test` to verify your implementation
4. **View in Browser**: Run `npm start` and navigate to the task page

## Project Features

### React Application (`React-CSS/react-todo-app/`)

- **TypeScript**: Full type safety
- **React Router**: Navigation between tasks
- **Modern UI**: Clean, responsive interface
- **Live Preview**: See your components in real-time
- **Comprehensive Testing**: Jest + React Testing Library

### Testing Infrastructure

- **Jest**: Fast, reliable test runner
- **Coverage Reports**: Track your progress
- **Watch Mode**: Automatic test re-runs
- **Isolated Tests**: Each topic has dedicated test files

### Development Experience

- **Hot Reload**: Instant feedback in React app
- **TypeScript**: IntelliSense and error checking
- **ESLint**: Code quality enforcement
- **Git Integration**: Version control ready

## Best Practices

### Code Organization

- Keep solutions in the `solutions/` folders
- Don't modify `tasks/` files directly
- Use meaningful commit messages
- Test your code before committing

### React Development

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write comprehensive tests

### Git Workflow

- Commit frequently with clear messages
- Use branches for experiments
- Don't commit `node_modules/` or `.env` files
- Push your complete solution for review

## Troubleshooting

### Common Issues

- **Tests Failing**: Check that your solution exports match the expected format
- **React App Not Starting**: Ensure all dependencies are installed
- **TypeScript Errors**: Check your type definitions and imports
- **Git Issues**: Make sure you're not committing sensitive files

### Getting Help

- Read task descriptions carefully
- Check the test files for expected output format
- Use the provided examples as guides
- Test your solutions incrementally

## Next Steps

After completing all tasks:

1. **Review Your Code**: Ensure all solutions work correctly
2. **Run All Tests**: Verify everything passes
3. **Documentation**: Add comments to complex solutions
4. **Share Your Work**: Push to your repository and share the link

Good luck and happy coding! 🚀
