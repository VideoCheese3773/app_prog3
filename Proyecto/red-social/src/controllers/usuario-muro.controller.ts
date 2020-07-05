import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Usuario,
  Muro,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioMuroController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/muro', {
    responses: {
      '200': {
        description: 'Muro belonging to Usuario',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Muro)},
          },
        },
      },
    },
  })
  async getMuro(
    @param.path.string('id') id: typeof Usuario.prototype.id_usuario,
  ): Promise<Muro> {
    return this.usuarioRepository.muro(id);
  }
}
