import { FastifyInstance } from 'fastify';

import { FilesController } from '../../../modules/files/files.controller';

export class FilesRoutes {
  constructor(private filesController: FilesController) {}

  getRoutes = async (app: FastifyInstance) => {
    app.get('/:user/:repo', this.filesController.listMDFiles);

    app.get(
      '/:user/:repo/:filePath',
      this.filesController.showGithubFileContent,
    );
  };
}
