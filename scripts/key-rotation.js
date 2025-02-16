const axios = require('axios');
const { Octokit } = require('@octokit/rest');

async function rotateUnsplashKeys() {
  // 1. Generate new Unsplash API keys
  const newAccessKey = generateSecureKey();
  const newSecretKey = generateSecureKey();

  // 2. Update Unsplash Application Settings
  await updateUnsplashKeys(newAccessKey, newSecretKey);

  // 3. Update GitHub Secrets
  await updateGitHubSecrets({
    UNSPLASH_ACCESS_KEY: newAccessKey,
    UNSPLASH_SECRET_KEY: newSecretKey
  });

  // 4. Log rotation event
  logKeyRotation();
}

function generateSecureKey() {
  return crypto.randomBytes(32).toString('hex');
}

async function updateGitHubSecrets(secrets) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  for (const [key, value] of Object.entries(secrets)) {
    await octokit.actions.createOrUpdateRepoSecret({
      owner: 'your-username',
      repo: 'zillow-ai-concierge',
      secret_name: key,
      encrypted_value: encryptSecret(value)
    });
  }
}

// Schedule key rotation every 90 days
cron.schedule('0 0 1 */3 *', rotateUnsplashKeys); 