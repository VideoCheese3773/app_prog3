import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Denuncia, DenunciaRelations, Publicacion, Administrador} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PublicacionRepository} from './publicacion.repository';
import {AdministradorRepository} from './administrador.repository';

export class DenunciaRepository extends DefaultCrudRepository<
  Denuncia,
  typeof Denuncia.prototype.id_denuncia,
  DenunciaRelations
> {

  public readonly publicacion: BelongsToAccessor<Publicacion, typeof Denuncia.prototype.id_denuncia>;

  public readonly administrador: BelongsToAccessor<Administrador, typeof Denuncia.prototype.id_denuncia>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('PublicacionRepository') protected publicacionRepositoryGetter: Getter<PublicacionRepository>, @repository.getter('AdministradorRepository') protected administradorRepositoryGetter: Getter<AdministradorRepository>,
  ) {
    super(Denuncia, dataSource);
    this.administrador = this.createBelongsToAccessorFor('administrador', administradorRepositoryGetter,);
    this.registerInclusionResolver('administrador', this.administrador.inclusionResolver);
    this.publicacion = this.createBelongsToAccessorFor('publicacion', publicacionRepositoryGetter,);
    this.registerInclusionResolver('publicacion', this.publicacion.inclusionResolver);
  }
}
