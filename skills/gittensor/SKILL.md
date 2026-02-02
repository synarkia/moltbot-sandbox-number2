---
name: gittensor
description: Interact with GitTensor mining operations, including cloning repositories, applying fixes, and submitting pull requests.
---

# GitTensor Mining Skill

This skill provides tools to automate the GitTensor mining workflow: identifying issues, cloning repositories, applying fixes, and submitting PRs.

## Prerequisites

- `GITHUB_TOKEN` environment variable set with repo permissions.
- `git` installed in the environment (added to Dockerfile).

## Scripts

### Setup Git Identity
Configures the git user and email for commits.
```bash
node /root/clawd/skills/gittensor/scripts/setup_git.js "Miner Bot" "miner@example.com"
```

### Clone and Fix
Clones a repository and prepares it for a fix.
```bash
node /root/clawd/skills/gittensor/scripts/clone_and_fix.js https://github.com/owner/repo.git branch-name
```

### Submit Pull Request
Pushes changes and creates a pull request.
```bash
node /root/clawd/skills/gittensor/scripts/submit_pr.js "Title of PR" "Description of changes"
```

## Usage Pattern

1. **Setup**: Run `setup_git.js` once at the start of a session.
2. **Clone**: Use `clone_and_fix.js` to get the target repo.
3. **Work**: Agent edits files in the cloned directory to solve the issue.
4. **Submit**: Use `submit_pr.js` to push and open a PR.
