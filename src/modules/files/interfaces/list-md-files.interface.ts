import { GitHubRepoParamsDTO } from '../dtos/github-repo-params.dto';

export type TreeNode = {
  name: string;
  path?: string;
  items?: TreeNode[];
};

export interface IListMDFiles {
  execute(params: GitHubRepoParamsDTO): Promise<TreeNode[] | undefined>;
}
