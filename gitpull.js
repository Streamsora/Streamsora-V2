const simpleGit = require('simple-git');
const git = simpleGit();

// Check if the required command-line arguments are provided
if (process.argv.length < 4) {
  console.error('Usage: node auto-git-pull.js <GitHub_Username> <GitHub_Token>');
  process.exit(1);
}

const username = process.argv[2];
const token = process.argv[3];

// Set GitHub credentials using environment variables
process.env.GITHUB_USERNAME = username;
process.env.GITHUB_TOKEN = token;

// Function to perform a Git pull
const gitPull = () => {
  git.pull((error, update) => {
    if (error) {
      console.error('Error while pulling from Git:', error);
    } else {
      if (update && update.summary.changes) {
        console.log('Git pull successful. Changes detected:', update.summary.changes);

        // Run npm run build after pulling
        console.log('Running npm run build...');
        const { exec } = require('child_process');
        exec('npm run build', (error, stdout, stderr) => {
          if (error) {
            console.error('Error while running npm run build:', error);
          } else {
            console.log('npm run build completed successfully.');
          }
        });
      } else {
        console.log('No changes detected. Your project is up to date.');
      }
    }
  });
};

// Execute Git pull
gitPull();
