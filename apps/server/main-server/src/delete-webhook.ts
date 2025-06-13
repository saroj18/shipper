import { CacheProvider } from '@repo/redis';
import axios from 'axios';

export async function deleteWebhook(github_username: string, github_repo_name: string) {
  try {
    const webHookInfo = JSON.parse(
      await CacheProvider.getDataFromCache(`${github_username}-${github_repo_name}-webhook`)
    );

    const response = await axios.delete(
      `https://api.github.com/repos/${github_username}/${github_repo_name}/hooks/${webHookInfo.webHookId}`,
      {
        headers: {
          Authorization: `token ${webHookInfo.token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': github_username,
        },
      }
    );

    console.log(`🗑️ Webhook with ID ${webHookInfo.webHookId} deleted successfully`);
  } catch (error: any) {
    if (error.response) {
      console.error('❌ GitHub API Error:', error.response.data);
    } else {
      console.error('❌ Network/Error:', error.message);
    }
  }
}
