import { container, injectable } from 'tsyringe';
import { GitHubAPI, GitHubFile } from '../../../shared/providers/githubApi';
import { GitHubRepoParamsDTO } from '../dtos/github-repo-params.dto';

@injectable()
export class ShowGitHubFileContentService {
  async execute({
    user,
    repo,
    filePath,
  }: GitHubRepoParamsDTO): Promise<GitHubFile> {
    const githubApi = container.resolve(GitHubAPI);

    const fileContent = await githubApi.getFileContent({
      user,
      repo,
      filePath,
    });

    const { path, content, name } = fileContent;

    const decodedContent = Buffer.from(String(content), 'base64').toString(
      'utf-8',
    );

    const file: GitHubFile = {
      path,
      name,
      content: decodedContent,
    };

    return file;
  }
}
