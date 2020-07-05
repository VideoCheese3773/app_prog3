import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Imagen,
  Publicacion,
} from '../models';
import {ImagenRepository} from '../repositories';

export class ImagenPublicacionController {
  constructor(
    @repository(ImagenRepository)
    public imagenRepository: ImagenRepository,
  ) { }

  @get('/imagens/{id}/publicacion', {
    responses: {
      '200': {
        description: 'Publicacion belonging to Imagen',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Publicacion)},
          },
        },
      },
    },
  })
  async getPublicacion(
    @param.path.string('id') id: typeof Imagen.prototype.id_imagen,
  ): Promise<Publicacion> {
    return this.imagenRepository.imagen(id);
  }
}
