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
  Publicacion,
} from '../models';
import {DenunciaRepository} from '../repositories';

export class DenunciaPublicacionController {
  constructor(
    @repository(DenunciaRepository)
    public denunciaRepository: DenunciaRepository,
  ) { }

  @get('/denuncias/{id}/publicacion', {
    responses: {
      '200': {
        description: 'Publicacion belonging to Denuncia',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Publicacion)},
          },
        },
      },
    },
  })
  async getPublicacion(
    @param.path.string('id') id: typeof Denuncia.prototype.id_denuncia,
  ): Promise<Publicacion> {
    return this.denunciaRepository.publicacion(id);
  }
}
