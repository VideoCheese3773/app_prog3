import {DefaultCrudRepository} from '@loopback/repository';
import {Comentario, ComentarioRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ComentarioRepository extends DefaultCrudRepository<
  Comentario,
  typeof Comentario.prototype.id_comentario,
  ComentarioRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Comentario, dataSource);
  }
}
