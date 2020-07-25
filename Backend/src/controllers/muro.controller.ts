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
import {Muro} from '../models';
import {MuroRepository} from '../repositories';

export class MuroController {
  constructor(
    @repository(MuroRepository)
    public muroRepository : MuroRepository,
  ) {}

  @post('/muros', {
    responses: {
      '200': {
        description: 'Muro model instance',
        content: {'application/json': {schema: getModelSchemaRef(Muro)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Muro, {
            title: 'NewMuro',
            exclude: ['id_muro'],
          }),
        },
      },
    })
    muro: Omit<Muro, 'id_muro'>,
  ): Promise<Muro> {
    return this.muroRepository.create(muro);
  }

  @get('/muros/count', {
    responses: {
      '200': {
        description: 'Muro model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Muro) where?: Where<Muro>,
  ): Promise<Count> {
    return this.muroRepository.count(where);
  }

  @get('/muros', {
    responses: {
      '200': {
        description: 'Array of Muro model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Muro, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Muro) filter?: Filter<Muro>,
  ): Promise<Muro[]> {
    return this.muroRepository.find(filter);
  }

  @patch('/muros', {
    responses: {
      '200': {
        description: 'Muro PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Muro, {partial: true}),
        },
      },
    })
    muro: Muro,
    @param.where(Muro) where?: Where<Muro>,
  ): Promise<Count> {
    return this.muroRepository.updateAll(muro, where);
  }

  @get('/muros/{id}', {
    responses: {
      '200': {
        description: 'Muro model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Muro, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Muro, {exclude: 'where'}) filter?: FilterExcludingWhere<Muro>
  ): Promise<Muro> {
    return this.muroRepository.findById(id, filter);
  }

  @patch('/muros/{id}', {
    responses: {
      '204': {
        description: 'Muro PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Muro, {partial: true}),
        },
      },
    })
    muro: Muro,
  ): Promise<void> {
    await this.muroRepository.updateById(id, muro);
  }

  @put('/muros/{id}', {
    responses: {
      '204': {
        description: 'Muro PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() muro: Muro,
  ): Promise<void> {
    await this.muroRepository.replaceById(id, muro);
  }

  @del('/muros/{id}', {
    responses: {
      '204': {
        description: 'Muro DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.muroRepository.deleteById(id);
  }
}
