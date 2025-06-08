import axios from 'axios';

export async function addWebhook(
  github_username: string,
  github_repo_name: string,
  webhookUrl: string,
  github_token: string
) {
  try {
    const response = await axios.post(
      `https://api.github.com/repos/${github_username}/${github_repo_name}/hooks`,
      {
        name: 'web',
        active: true,
        events: ['push'],
        config: {
          url: webhookUrl,
          content_type: 'json',
          insecure_ssl: '0',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${github_token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': github_username,
        },
      }
    );

    console.log('✅ Webhook added:', response.data);
  } catch (error: any) {
    if (error.response) {
      console.error('❌ GitHub API Error:', error.response.data);
    } else {
      console.error('❌ Network/Error:', error.message);
    }
  }
}

