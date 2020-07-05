import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Denuncia, DenunciaRelations, Publicacion} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PublicacionRepository} from './publicacion.repository';

export class DenunciaRepository extends DefaultCrudRepository<
  Denuncia,
  typeof Denuncia.prototype.id_denuncia,
  DenunciaRelations
> {

  public readonly publicacion: BelongsToAccessor<Publicacion, typeof Denuncia.prototype.id_denuncia>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('PublicacionRepository') protected publicacionRepositoryGetter: Getter<PublicacionRepository>,
  ) {
    super(Denuncia, dataSource);
    this.publicacion = this.createBelongsToAccessorFor('publicacion', publicacionRepositoryGetter,);
    this.registerInclusionResolver('publicacion', this.publicacion.inclusionResolver);
  }
}
