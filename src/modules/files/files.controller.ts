import { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import { ListMDFilesService } from './services/list-md-files.service';
import { ShowGitHubFileContentService } from './services/show-file-content.service';

export class FilesController {
  async listMDFiles(request: FastifyRequest) {
    const createTransactionBodySchema = z.object({
      user: z.string(),
      repo: z.string(),
    });

    const { user, repo } = createTransactionBodySchema.parse(request.params);

    const listMDFilesService = container.resolve(ListMDFilesService);

    return listMDFilesService.execute({ user, repo });
  }

  async showGithubFileContent(request: FastifyRequest) {
    const createTransactionBodySchema = z.object({
      user: z.string(),
      repo: z.string(),
      filePath: z.string(),
    });

    const { user, repo, filePath } = createTransactionBodySchema.parse(
      request.params,
    );

    const showGithubFileContentService = container.resolve(
      ShowGitHubFileContentService,
    );

    return showGithubFileContentService.execute({ user, repo, filePath });
  }
}
