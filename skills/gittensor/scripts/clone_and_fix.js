const { execSync } = require('child_process');
const fs = require('fs');

const repoUrl = process.argv[2];
const branchName = process.argv[3];

if (!repoUrl || !branchName) {
    console.error('Usage: node clone_and_fix.js <repo_url> <branch_name>');
    process.exit(1);
}

try {
    // Extract repo name from URL
    const repoName = repoUrl.split('/').pop().replace('.git', '');
    const targetDir = `/root/workspace/${repoName}`;

    if (fs.existsSync(targetDir)) {
        console.log(`Directory ${targetDir} already exists. Removing...`);
        fs.rmSync(targetDir, { recursive: true, force: true });
    }

    // Inject token into URL if GITHUB_TOKEN is present
    let authUrl = repoUrl;
    if (process.env.GITHUB_TOKEN && repoUrl.startsWith('https://github.com/')) {
        authUrl = repoUrl.replace('https://github.com/', `https://${process.env.GITHUB_TOKEN}@github.com/`);
    }

    console.log(`Cloning ${repoUrl} into ${targetDir}...`);
    execSync(`git clone ${authUrl} ${targetDir}`);

    process.chdir(targetDir);

    console.log(`Checking out new branch ${branchName}...`);
    execSync(`git checkout -b ${branchName}`);

    console.log(`Repository ready at ${targetDir}`);
} catch (error) {
    console.error('Failed to clone and setup repo:', error.message);
    process.exit(1);
}
