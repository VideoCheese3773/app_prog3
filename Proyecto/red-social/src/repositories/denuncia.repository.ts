import {DefaultCrudRepository} from '@loopback/repository';
import {Denuncia, DenunciaRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DenunciaRepository extends DefaultCrudRepository<
  Denuncia,
  typeof Denuncia.prototype.id_denuncia,
  DenunciaRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Denuncia, dataSource);
  }
}
