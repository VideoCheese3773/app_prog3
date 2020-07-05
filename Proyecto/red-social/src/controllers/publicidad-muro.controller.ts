import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Publicidad,
  Muro,
} from '../models';
import {PublicidadRepository} from '../repositories';

export class PublicidadMuroController {
  constructor(
    @repository(PublicidadRepository)
    public publicidadRepository: PublicidadRepository,
  ) { }

  @get('/publicidads/{id}/muro', {
    responses: {
      '200': {
        description: 'Muro belonging to Publicidad',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Muro)},
          },
        },
      },
    },
  })
  async getMuro(
    @param.path.string('id') id: typeof Publicidad.prototype.id_publicidad,
  ): Promise<Muro> {
    return this.publicidadRepository.publicidadMuro(id);
  }
}
