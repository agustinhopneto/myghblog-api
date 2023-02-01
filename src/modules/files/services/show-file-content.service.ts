import { GitHubAPI, GitHubFile } from '../../../shared/providers/githubApi';
import { GitHubRepoParamsDTO } from '../dtos/github-repo-params.dto';
import { IShowGitHubFileContent } from '../interfaces/show-file-content.interface';

export class ShowGitHubFileContent implements IShowGitHubFileContent {
  constructor(private gitHubApi: GitHubAPI) {}

  async execute({
    user,
    repo,
    filePath,
  }: GitHubRepoParamsDTO): Promise<GitHubFile> {
    const { path, name, content } = await this.gitHubApi.getFileContent({
      user,
      repo,
      filePath,
    });

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

(async () => {
  console.log(
    await new ShowGitHubFileContent(new GitHubAPI()).execute({
      user: 'agustinhopneto',
      repo: 'morsa',
      filePath: 'README.md',
    }),
  );
})();
