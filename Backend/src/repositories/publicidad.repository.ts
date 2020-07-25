import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Publicidad, PublicidadRelations, Administrador, Muro} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AdministradorRepository} from './administrador.repository';
import {MuroRepository} from './muro.repository';

export class PublicidadRepository extends DefaultCrudRepository<
  Publicidad,
  typeof Publicidad.prototype.id_publicidad,
  PublicidadRelations
> {

  public readonly publicidad: BelongsToAccessor<Administrador, typeof Publicidad.prototype.id_publicidad>;

  public readonly publicidadMuro: BelongsToAccessor<Muro, typeof Publicidad.prototype.id_publicidad>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('AdministradorRepository') protected administradorRepositoryGetter: Getter<AdministradorRepository>, @repository.getter('MuroRepository') protected muroRepositoryGetter: Getter<MuroRepository>,
  ) {
    super(Publicidad, dataSource);
    this.publicidadMuro = this.createBelongsToAccessorFor('publicidadMuro', muroRepositoryGetter,);
    this.registerInclusionResolver('publicidadMuro', this.publicidadMuro.inclusionResolver);
    this.publicidad = this.createBelongsToAccessorFor('publicidad', administradorRepositoryGetter,);
    this.registerInclusionResolver('publicidad', this.publicidad.inclusionResolver);
  }
}
