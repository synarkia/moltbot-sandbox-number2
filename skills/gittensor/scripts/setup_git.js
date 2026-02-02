const { execSync } = require('child_process');

const name = process.argv[2];
const email = process.argv[3];

if (!name || !email) {
    console.error('Usage: node setup_git.js <name> <email>');
    process.exit(1);
}

try {
    console.log(`Setting git config user.name to "${name}"`);
    execSync(`git config --global user.name "${name}"`);

    console.log(`Setting git config user.email to "${email}"`);
    execSync(`git config --global user.email "${email}"`);

    console.log('Git identity configured successfully.');
} catch (error) {
    console.error('Failed to configure git identity:', error.message);
    process.exit(1);
}
