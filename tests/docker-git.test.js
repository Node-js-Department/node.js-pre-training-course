const fs = require('fs');

function readSolution(taskNumber) {
  return fs.readFileSync(`Docker-Git/solutions/task-${taskNumber}.txt`, 'utf8');
}

describe('Task 01: Git Fundamentals', () => {
  it('should document git init and the commit history', () => {
    const txt = readSolution('01');
    expect(txt).toMatch(/git init/i);
    expect(txt).toMatch(/git log/i);
  });
});

describe('Task 02: Git Branching', () => {
  it('should document creating and merging a feature branch', () => {
    const txt = readSolution('02');
    expect(txt).toMatch(/git branch/i);
    expect(txt).toMatch(/git merge/i);
  });
});

describe('Task 03: Docker Fundamentals', () => {
  it('should document the Dockerfile and container run commands', () => {
    const txt = readSolution('03');
    expect(txt).toMatch(/FROM node/i);
    expect(txt).toMatch(/docker (build|run)/i);
  });
});

describe('Task 04: Git Conflicts', () => {
  it('should document the merge conflict and its resolution', () => {
    const txt = readSolution('04');
    expect(txt).toMatch(/git merge/i);
    expect(txt).toMatch(/conflict/i);
  });
});

describe('Task 05: Docker Optimization (Multi-stage builds)', () => {
  it('should document both Dockerfile versions and .dockerignore', () => {
    const txt = readSolution('05');
    expect(txt).toMatch(/multi-stage/i);
    expect(txt).toMatch(/\.dockerignore/i);
  });
});

describe('Task 06: Git Advanced (Rebase)', () => {
  it('should document the interactive rebase workflow', () => {
    const txt = readSolution('06');
    expect(txt).toMatch(/git rebase/i);
  });
});

describe('Task 07: Docker Compose', () => {
  it('should document the multi-service docker-compose setup', () => {
    const txt = readSolution('07');
    expect(txt).toMatch(/docker-compose|docker compose/i);
    expect(txt).toMatch(/postgres/i);
    expect(txt).toMatch(/pgadmin/i);
  });
});

describe('Task 08: Git Workflow with Multiple Remotes', () => {
  it('should document the remote configuration and safe force-push workflow', () => {
    const txt = readSolution('08');
    expect(txt).toMatch(/git remote/i);
    expect(txt).toMatch(/force-with-lease/i);
  });
});

describe('Task 09: Docker Commands', () => {
  it('should document image commands and evidence of before/after cleanup', () => {
    const txt = readSolution('09');
    expect(txt).toMatch(/docker pull/i);
    expect(txt).toMatch(/docker system df/i);
    expect(txt).toMatch(/docker system prune/i);
  });
});

describe('Task 10: Docker Networks & Volumes', () => {
  it('should document custom networks and volume persistence', () => {
    const txt = readSolution('10');
    expect(txt).toMatch(/docker network/i);
    expect(txt).toMatch(/volume/i);
  });
});
