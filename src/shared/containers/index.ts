import { container } from 'tsyringe';
import { ListMDFilesService } from '../../modules/files/services/list-md-files.service';
import { ShowGitHubFileContentService } from '../../modules/files/services/show-file-content.service';
import { GitHubAPI } from '../providers/githubApi';
import { InjectKeys } from './keys';

container.registerSingleton<GitHubAPI>(InjectKeys.GITHUB_API, GitHubAPI);

container.registerSingleton<ListMDFilesService>(
  InjectKeys.LIST_MD_FILES_SERVICE,
  ListMDFilesService,
);

container.registerSingleton<ShowGitHubFileContentService>(
  InjectKeys.SHOW_GITHUB_FILE_CONTENT,
  ShowGitHubFileContentService,
);
