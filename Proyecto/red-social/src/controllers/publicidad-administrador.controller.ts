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
  Administrador,
} from '../models';
import {PublicidadRepository} from '../repositories';

export class PublicidadAdministradorController {
  constructor(
    @repository(PublicidadRepository)
    public publicidadRepository: PublicidadRepository,
  ) { }

  @get('/publicidads/{id}/administrador', {
    responses: {
      '200': {
        description: 'Administrador belonging to Publicidad',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Administrador)},
          },
        },
      },
    },
  })
  async getAdministrador(
    @param.path.string('id') id: typeof Publicidad.prototype.id_publicidad,
  ): Promise<Administrador> {
    return this.publicidadRepository.publicidad(id);
  }
}
