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
  Publicacion,
  Denuncia,
} from '../models';
import {PublicacionRepository} from '../repositories';

export class PublicacionDenunciaController {
  constructor(
    @repository(PublicacionRepository) protected publicacionRepository: PublicacionRepository,
  ) { }

  @get('/publicacions/{id}/denuncias', {
    responses: {
      '200': {
        description: 'Array of Publicacion has many Denuncia',
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
    return this.publicacionRepository.denuncias(id).find(filter);
  }

  @post('/publicacions/{id}/denuncias', {
    responses: {
      '200': {
        description: 'Publicacion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Denuncia)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Publicacion.prototype.id_publicacion,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Denuncia, {
            title: 'NewDenunciaInPublicacion',
            exclude: ['id_denuncia'],
            optional: ['publicacionId']
          }),
        },
      },
    }) denuncia: Omit<Denuncia, 'id_denuncia'>,
  ): Promise<Denuncia> {
    return this.publicacionRepository.denuncias(id).create(denuncia);
  }

  @patch('/publicacions/{id}/denuncias', {
    responses: {
      '200': {
        description: 'Publicacion.Denuncia PATCH success count',
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
    return this.publicacionRepository.denuncias(id).patch(denuncia, where);
  }

  @del('/publicacions/{id}/denuncias', {
    responses: {
      '200': {
        description: 'Publicacion.Denuncia DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Denuncia)) where?: Where<Denuncia>,
  ): Promise<Count> {
    return this.publicacionRepository.denuncias(id).delete(where);
  }
}
