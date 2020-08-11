import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Denuncia,
  Administrador,
} from '../models';
import {DenunciaRepository} from '../repositories';

export class DenunciaAdministradorController {
  constructor(
    @repository(DenunciaRepository)
    public denunciaRepository: DenunciaRepository,
  ) { }

  @get('/denuncias/{id}/administrador', {
    responses: {
      '200': {
        description: 'Administrador belonging to Denuncia',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Administrador)},
          },
        },
      },
    },
  })
  async getAdministrador(
    @param.path.string('id') id: typeof Denuncia.prototype.id_denuncia,
  ): Promise<Administrador> {
    return this.denunciaRepository.administrador(id);
  }
}
