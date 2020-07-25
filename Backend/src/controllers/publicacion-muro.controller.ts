import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Publicacion,
  Muro,
} from '../models';
import {PublicacionRepository} from '../repositories';

export class PublicacionMuroController {
  constructor(
    @repository(PublicacionRepository)
    public publicacionRepository: PublicacionRepository,
  ) { }

  @get('/publicacions/{id}/muro', {
    responses: {
      '200': {
        description: 'Muro belonging to Publicacion',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Muro)},
          },
        },
      },
    },
  })
  async getMuro(
    @param.path.string('id') id: typeof Publicacion.prototype.id_publicacion,
  ): Promise<Muro> {
    return this.publicacionRepository.muro(id);
  }
}
