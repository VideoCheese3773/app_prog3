import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Administrador,
  Denuncia,
} from '../models';
import {AdministradorRepository} from '../repositories';

export class AdministradorDenunciaController {
  constructor(
    @repository(AdministradorRepository) protected administradorRepository: AdministradorRepository,
  ) { }

  @get('/administradors/{id}/denuncias', {
    responses: {
      '200': {
        description: 'Array of Administrador has many Denuncia',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Denuncia)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Denuncia>,
  ): Promise<Denuncia[]> {
    return this.administradorRepository.denuncias(id).find(filter);
  }

  @post('/administradors/{id}/denuncias', {
    responses: {
      '200': {
        description: 'Administrador model instance',
        content: {'application/json': {schema: getModelSchemaRef(Denuncia)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Administrador.prototype.id_administrador,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Denuncia, {
            title: 'NewDenunciaInAdministrador',
            exclude: ['id_denuncia'],
            optional: ['administradorId']
          }),
        },
      },
    }) denuncia: Omit<Denuncia, 'id_denuncia'>,
  ): Promise<Denuncia> {
    return this.administradorRepository.denuncias(id).create(denuncia);
  }

  @patch('/administradors/{id}/denuncias', {
    responses: {
      '200': {
        description: 'Administrador.Denuncia PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Denuncia, {partial: true}),
        },
      },
    })
    denuncia: Partial<Denuncia>,
    @param.query.object('where', getWhereSchemaFor(Denuncia)) where?: Where<Denuncia>,
  ): Promise<Count> {
    return this.administradorRepository.denuncias(id).patch(denuncia, where);
  }

  @del('/administradors/{id}/denuncias', {
    responses: {
      '200': {
        description: 'Administrador.Denuncia DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Denuncia)) where?: Where<Denuncia>,
  ): Promise<Count> {
    return this.administradorRepository.denuncias(id).delete(where);
  }
}
