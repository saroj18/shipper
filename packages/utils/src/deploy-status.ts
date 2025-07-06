import axios from 'axios';

type SetGitHubStatusParams = {
  owner: string;
  repo: string;
  sha: string;
  state: 'pending' | 'success' | 'failure';
  description: string;
  context?: string;
  githubToken: string;
};

export async function setGitHubStatus({
  owner,
  repo,
  sha,
  state,
  description,
  context = 'custom-deploy',
  githubToken,
}: SetGitHubStatusParams): Promise<void> {
  console.log('owner', owner);
  console.log('repo', repo);
  console.log('sha', sha);
  console.log('state', state);
  console.log('description', description);
  console.log('context', context);
  console.log('githubToken', githubToken);
  try {
    await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/statuses/${sha}`,
      {
        state,
        description,
        context,
      },
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error setting GitHub status:', error);
  }
}
