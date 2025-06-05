export type RepoType = {
  id: string;
  name: string;
  created_at: string;
  createdBy: string;
  branch: string;
  commitId: string;
  owner: any;
  permissions: {
    admin: boolean;
  };
  private: boolean;
  html_url: string;
  ssh_url: string;
};

export type AllRepoType = {
  data: RepoType[];
};
export type SingleRepoType = {
  data: RepoType;
};

export type UserType = {
  username: string;
  id: string;
  email: string;
};

export type Project = {
  name: string;
  createdBy: string;
  project_url: string;
  serverDomain: string;
  clientDomain: string;
  serverDockerImage: string;
  creatorId: string;
  env: [
    {
      key: string;
      value: string;
    },
  ];
  serverStatus: 'running' | 'stopped' | 'error';
  createdAt: Date;
  updatedAt: Date;
};
