import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {Publicacion, PublicacionRelations, Usuario, Muro, Denuncia, Comentario} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UsuarioRepository} from './usuario.repository';
import {MuroRepository} from './muro.repository';
import {DenunciaRepository} from './denuncia.repository';
import {ComentarioRepository} from './comentario.repository';

export class PublicacionRepository extends DefaultCrudRepository<
  Publicacion,
  typeof Publicacion.prototype.id_publicacion,
  PublicacionRelations
> {

  public readonly usuario: BelongsToAccessor<Usuario, typeof Publicacion.prototype.id_publicacion>;

  public readonly muro: BelongsToAccessor<Muro, typeof Publicacion.prototype.id_publicacion>;

  public readonly denuncias: HasManyRepositoryFactory<Denuncia, typeof Publicacion.prototype.id_publicacion>;

  public readonly comentarios: HasManyRepositoryFactory<Comentario, typeof Publicacion.prototype.id_publicacion>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('MuroRepository') protected muroRepositoryGetter: Getter<MuroRepository>, @repository.getter('DenunciaRepository') protected denunciaRepositoryGetter: Getter<DenunciaRepository>, @repository.getter('ComentarioRepository') protected comentarioRepositoryGetter: Getter<ComentarioRepository>,
  ) {
    super(Publicacion, dataSource);
    this.comentarios = this.createHasManyRepositoryFactoryFor('comentarios', comentarioRepositoryGetter,);
    this.registerInclusionResolver('comentarios', this.comentarios.inclusionResolver);
    this.denuncias = this.createHasManyRepositoryFactoryFor('denuncias', denunciaRepositoryGetter,);
    this.registerInclusionResolver('denuncias', this.denuncias.inclusionResolver);
    this.muro = this.createBelongsToAccessorFor('muro', muroRepositoryGetter,);
    this.registerInclusionResolver('muro', this.muro.inclusionResolver);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }
}
