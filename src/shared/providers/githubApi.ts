import axios, { AxiosInstance } from 'axios';
import { GitHubRepoParamsDTO } from '../../modules/files/dtos/github-repo-params.dto';

export type GitHubBranch = {
  name: string;
};

export type GitHubFile = {
  name?: string;
  path: string;
  content?: string;
};

export type GitHubBranchFiles = {
  tree: GitHubFile[];
};

export class GitHubAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.github.com/',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        accept: 'application/vnd.github+raw',
      },
    });
  }

  async getRepoBranches({
    user,
    repo,
  }: GitHubRepoParamsDTO): Promise<GitHubBranch[]> {
    const { data: branches } = await this.api.get<GitHubBranch[]>(
      `/repos/${user}/${repo}/branches`,
    );

    return branches;
  }

  async getBranchFiles({
    user,
    repo,
    mainBranch,
  }: GitHubRepoParamsDTO): Promise<GitHubFile[]> {
    const { data: branchFiles } = await this.api.get<GitHubBranchFiles>(
      `/repos/${user}/${repo}/git/trees/${mainBranch}`,
      {
        params: {
          recursive: 1,
        },
      },
    );

    return branchFiles.tree;
  }

  async getFileContent({
    user,
    repo,
    filePath,
  }: GitHubRepoParamsDTO): Promise<GitHubFile> {
    const { data: file } = await this.api.get<GitHubFile>(
      `/repos/${user}/${repo}/contents/${filePath}`,
    );

    return file;
  }
}
