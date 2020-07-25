import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Muro, MuroRelations, Usuario} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UsuarioRepository} from './usuario.repository';

export class MuroRepository extends DefaultCrudRepository<
  Muro,
  typeof Muro.prototype.id_muro,
  MuroRelations
> {

  public readonly muro: BelongsToAccessor<Usuario, typeof Muro.prototype.id_muro>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(Muro, dataSource);
    this.muro = this.createBelongsToAccessorFor('muro', usuarioRepositoryGetter,);
    this.registerInclusionResolver('muro', this.muro.inclusionResolver);
  }
}
