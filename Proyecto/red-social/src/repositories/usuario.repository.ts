import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {Usuario, UsuarioRelations, Publicacion, Comentario, Administrador, Muro} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PublicacionRepository} from './publicacion.repository';
import {ComentarioRepository} from './comentario.repository';
import {AdministradorRepository} from './administrador.repository';
import {MuroRepository} from './muro.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id_usuario,
  UsuarioRelations
> {

  public readonly publicaciones: HasManyRepositoryFactory<Publicacion, typeof Usuario.prototype.id_usuario>;

  public readonly comentarios: HasManyRepositoryFactory<Comentario, typeof Usuario.prototype.id_usuario>;

  public readonly administradores: BelongsToAccessor<Administrador, typeof Usuario.prototype.id_usuario>;

  public readonly muro: BelongsToAccessor<Muro, typeof Usuario.prototype.id_usuario>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('PublicacionRepository') protected publicacionRepositoryGetter: Getter<PublicacionRepository>, @repository.getter('ComentarioRepository') protected comentarioRepositoryGetter: Getter<ComentarioRepository>, @repository.getter('AdministradorRepository') protected administradorRepositoryGetter: Getter<AdministradorRepository>, @repository.getter('MuroRepository') protected muroRepositoryGetter: Getter<MuroRepository>,
  ) {
    super(Usuario, dataSource);
    this.muro = this.createBelongsToAccessorFor('muro', muroRepositoryGetter,);
    this.registerInclusionResolver('muro', this.muro.inclusionResolver);
    this.administradores = this.createBelongsToAccessorFor('administradores', administradorRepositoryGetter,);
    this.registerInclusionResolver('administradores', this.administradores.inclusionResolver);
    this.comentarios = this.createHasManyRepositoryFactoryFor('comentarios', comentarioRepositoryGetter,);
    this.registerInclusionResolver('comentarios', this.comentarios.inclusionResolver);
    this.publicaciones = this.createHasManyRepositoryFactoryFor('publicaciones', publicacionRepositoryGetter,);
    this.registerInclusionResolver('publicaciones', this.publicaciones.inclusionResolver);
  }
}
