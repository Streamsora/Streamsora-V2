const simpleGit = require('simple-git');
const git = simpleGit();

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
