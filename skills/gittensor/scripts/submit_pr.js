const { execSync } = require('child_process');

const title = process.argv[2];
// Description might be long, so we might want to read from file or just use argv for now
const description = process.argv[3] || "Fix applied by GitTensor Miner";

if (!title) {
  console.error('Usage: node submit_pr.js <pr_title> [pr_description]');
  process.exit(1);
}

try {
  // Assume we are in the repo directory (or we should enforce a path)
  // For now, assume the agent CWD is correct or update this to accept a path.
  // Ideally, the agent would have `cd`ed into the repo.

  console.log('Adding all changes...');
  execSync('git add .');

  console.log(`Committing with message: ${title}`);
  execSync(`git commit -m "${title}"`);

  // Get current branch name
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

  console.log(`Pushing origin ${branch}...`);
  execSync(`git push -u origin ${branch}`);

  // PR creation via GitHub API would go here, or we instruct the user to open the link
  console.log('Changes pushed.');

  if (process.env.GITHUB_TOKEN) {
    console.log('Attempting to create PR via GitHub API...');
    // Simplistic PR creation
    // We need to parse owner/repo from remote
    const remoteUrl = execSync('git remote get-url origin').toString().trim();
    // remoteUrl format: https://TOKEN@github.com/owner/repo.git or https://github.com/owner/repo.git

    const match = remoteUrl.match(/github\.com\/([^\/]+)\/([^\/]+?)(\.git)?$/);
    if (match) {
      const owner = match[1];
      const repo = match[2];

      const prData = {
        title: title,
        body: description,
        head: branch,
        base: 'main' // careful assumption
      };

      console.log(`Creating PR on ${owner}/${repo}...`);

      const https = require('https');
      const prPayload = JSON.stringify(prData);

      const options = {
        hostname: 'api.github.com',
        port: 443,
        path: `/repos/${owner}/${repo}/pulls`,
        method: 'POST',
        headers: {
          'User-Agent': 'OpenClaw-GitTensor-Miner',
          'Authorization': 'token ' + process.env.GITHUB_TOKEN,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(prPayload)
        }
      };

      const req = https.request(options, (res) => {
        console.log(`GitHub API Status Code: ${res.statusCode}`);
        let responseBody = '';
        res.on('data', (chunk) => responseBody += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const json = JSON.parse(responseBody);
            console.log(`PR Created successfully: ${json.html_url}`);
          } else {
            console.error('Failed to create PR. Response:', responseBody);
          }
        });
      });

      req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        process.exit(1);
      });

      req.write(prPayload);
      req.end();
    }
  } else {
    console.log('GITHUB_TOKEN not found, skipping PR creation. Please create PR manually from pushed branch.');
  }

} catch (error) {
  console.error('Failed to submit PR:', error.message);
  process.exit(1);
}
