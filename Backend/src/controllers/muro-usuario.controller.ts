import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Muro,
  Usuario,
} from '../models';
import {MuroRepository} from '../repositories';

export class MuroUsuarioController {
  constructor(
    @repository(MuroRepository)
    public muroRepository: MuroRepository,
  ) { }

  @get('/muros/{id}/usuario', {
    responses: {
      '200': {
        description: 'Usuario belonging to Muro',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usuario)},
          },
        },
      },
    },
  })
  async getUsuario(
    @param.path.string('id') id: typeof Muro.prototype.id_muro,
  ): Promise<Usuario> {
    return this.muroRepository.muro(id);
  }
}
