import {DefaultCrudRepository} from '@loopback/repository';
import {Imagen, ImagenRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ImagenRepository extends DefaultCrudRepository<
  Imagen,
  typeof Imagen.prototype.id_imagen,
  ImagenRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Imagen, dataSource);
  }
}
