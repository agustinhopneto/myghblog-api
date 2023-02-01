import path from 'node:path';

import { GitHubAPI } from '../../../shared/providers/githubApi';
import { GitHubRepoParamsDTO } from '../dtos/github-repo-params.dto';
import { IListMDFiles, TreeNode } from '../interfaces/list-md-files.interface';

const ACCEPTED_BRANCHES = ['main', 'master'];

export class ListMDFiles implements IListMDFiles {
  constructor(private gitHubApi: GitHubAPI) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private fileTree(paths: string[], tree: Record<string, any> = {}) {
    return paths.reduce((fullTree, path) => {
      const [first, ...rest] = path.split('/');

      if (!rest.length) {
        fullTree[first] = true;
        return fullTree;
      }

      fullTree[first] = this.fileTree([rest.join('/')], fullTree[first]);

      return fullTree;
    }, tree);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseTree(tree: Record<string, any>, path?: string) {
    return Object.keys(tree).reduce((content, nodeKey) => {
      const node = tree[nodeKey];

      const fullPath = !path ? nodeKey : `${path}/${nodeKey}`;

      if (node === true) {
        content.push({
          name: nodeKey,
          path: fullPath,
        });
        return content;
      }

      content.push({
        name: nodeKey,
        items: this.parseTree(node, fullPath),
      });

      return content;
    }, [] as TreeNode[]);
  }

  async execute({
    user,
    repo,
  }: GitHubRepoParamsDTO): Promise<TreeNode[] | undefined> {
    const branches = await this.gitHubApi.getRepoBranches({ user, repo });

    const mainBranch = branches
      .map((branch) => branch.name)
      .find((name) => ACCEPTED_BRANCHES.includes(name));

    if (mainBranch) {
      const branchFiles = await this.gitHubApi.getBranchFiles({
        user,
        repo,
        mainBranch,
      });

      const mdFiles = branchFiles.reduce((acc, file) => {
        if (path.extname(String(file.path)).toLowerCase() === '.md') {
          acc.push(file.path);
        }

        return acc;
      }, [] as string[]);

      const tree = this.fileTree(mdFiles);

      const parsedTree = this.parseTree(tree);

      return parsedTree;
    }

    throw new Error('Main branch not found!');
  }
}
