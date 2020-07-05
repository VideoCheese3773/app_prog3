import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {Administrador, AdministradorRelations, Publicidad, Usuario} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PublicidadRepository} from './publicidad.repository';
import {UsuarioRepository} from './usuario.repository';

export class AdministradorRepository extends DefaultCrudRepository<
  Administrador,
  typeof Administrador.prototype.id_administrador,
  AdministradorRelations
> {

  public readonly publicidades: HasManyRepositoryFactory<Publicidad, typeof Administrador.prototype.id_administrador>;

  public readonly administrador: BelongsToAccessor<Usuario, typeof Administrador.prototype.id_administrador>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('PublicidadRepository') protected publicidadRepositoryGetter: Getter<PublicidadRepository>, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(Administrador, dataSource);
    this.administrador = this.createBelongsToAccessorFor('administrador', usuarioRepositoryGetter,);
    this.registerInclusionResolver('administrador', this.administrador.inclusionResolver);
    this.publicidades = this.createHasManyRepositoryFactoryFor('publicidades', publicidadRepositoryGetter,);
    this.registerInclusionResolver('publicidades', this.publicidades.inclusionResolver);
  }
}
