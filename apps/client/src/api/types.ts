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
};

export type AllRepoType = {
  data: RepoType[];
};
export type SingleRepoType = {
  data: RepoType;
};


export type UserType={
    username:string;
    id:string;
    email:string;
}