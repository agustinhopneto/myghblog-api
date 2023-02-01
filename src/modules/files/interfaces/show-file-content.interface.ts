import { GitHubFile } from '../../../shared/providers/githubApi';
import { GitHubRepoParamsDTO } from '../dtos/github-repo-params.dto';

export interface IShowGitHubFileContent {
  execute(params: GitHubRepoParamsDTO): Promise<GitHubFile>;
}
