import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Comentario,
  Imagen,
} from '../models';
import {ComentarioRepository} from '../repositories';

export class ComentarioImagenController {
  constructor(
    @repository(ComentarioRepository)
    public comentarioRepository: ComentarioRepository,
  ) { }

  @get('/comentarios/{id}/imagen', {
    responses: {
      '200': {
        description: 'Imagen belonging to Comentario',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Imagen)},
          },
        },
      },
    },
  })
  async getImagen(
    @param.path.string('id') id: typeof Comentario.prototype.id_comentario,
  ): Promise<Imagen> {
    return this.comentarioRepository.imagen(id);
  }
}
