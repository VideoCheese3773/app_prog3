import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Publicacion} from '../models';
import {PublicacionRepository} from '../repositories';

export class PublicacionController {
  constructor(
    @repository(PublicacionRepository)
    public publicacionRepository : PublicacionRepository,
  ) {}

  @post('/publicaciones', {
    responses: {
      '200': {
        description: 'Publicacion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Publicacion)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Publicacion, {
            title: 'NewPublicacion',
            exclude: ['id_publicacion'],
          }),
        },
      },
    })
    publicacion: Omit<Publicacion, 'id_publicacion'>,
  ): Promise<Publicacion> {
    return this.publicacionRepository.create(publicacion);
  }

  @get('/publicaciones/count', {
    responses: {
      '200': {
        description: 'Publicacion model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Publicacion) where?: Where<Publicacion>,
  ): Promise<Count> {
    return this.publicacionRepository.count(where);
  }

  @get('/publicaciones', {
    responses: {
      '200': {
        description: 'Array of Publicacion model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Publicacion, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Publicacion) filter?: Filter<Publicacion>,
  ): Promise<Publicacion[]> {
    return this.publicacionRepository.find(filter);
  }

  @patch('/publicaciones', {
    responses: {
      '200': {
        description: 'Publicacion PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Publicacion, {partial: true}),
        },
      },
    })
    publicacion: Publicacion,
    @param.where(Publicacion) where?: Where<Publicacion>,
  ): Promise<Count> {
    return this.publicacionRepository.updateAll(publicacion, where);
  }

  @get('/publicaciones/{id}', {
    responses: {
      '200': {
        description: 'Publicacion model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Publicacion, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Publicacion, {exclude: 'where'}) filter?: FilterExcludingWhere<Publicacion>
  ): Promise<Publicacion> {
    return this.publicacionRepository.findById(id, filter);
  }

  @patch('/publicaciones/{id}', {
    responses: {
      '204': {
        description: 'Publicacion PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Publicacion, {partial: true}),
        },
      },
    })
    publicacion: Publicacion,
  ): Promise<void> {
    await this.publicacionRepository.updateById(id, publicacion);
  }

  @put('/publicaciones/{id}', {
    responses: {
      '204': {
        description: 'Publicacion PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() publicacion: Publicacion,
  ): Promise<void> {
    await this.publicacionRepository.replaceById(id, publicacion);
  }

  @del('/publicaciones/{id}', {
    responses: {
      '204': {
        description: 'Publicacion DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.publicacionRepository.deleteById(id);
  }
}
