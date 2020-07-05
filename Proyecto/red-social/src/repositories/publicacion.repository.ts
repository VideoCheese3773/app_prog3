import {DefaultCrudRepository} from '@loopback/repository';
import {Publicacion, PublicacionRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PublicacionRepository extends DefaultCrudRepository<
  Publicacion,
  typeof Publicacion.prototype.id_publicacion,
  PublicacionRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Publicacion, dataSource);
  }
}
