import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Comentario, ComentarioRelations, Publicacion, Usuario, Imagen} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PublicacionRepository} from './publicacion.repository';
import {UsuarioRepository} from './usuario.repository';
import {ImagenRepository} from './imagen.repository';

export class ComentarioRepository extends DefaultCrudRepository<
  Comentario,
  typeof Comentario.prototype.id_comentario,
  ComentarioRelations
> {

  public readonly publicacion: BelongsToAccessor<Publicacion, typeof Comentario.prototype.id_comentario>;

  public readonly usuario: BelongsToAccessor<Usuario, typeof Comentario.prototype.id_comentario>;

  public readonly imagen: BelongsToAccessor<Imagen, typeof Comentario.prototype.id_comentario>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('PublicacionRepository') protected publicacionRepositoryGetter: Getter<PublicacionRepository>, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('ImagenRepository') protected imagenRepositoryGetter: Getter<ImagenRepository>,
  ) {
    super(Comentario, dataSource);
    this.imagen = this.createBelongsToAccessorFor('imagen', imagenRepositoryGetter,);
    this.registerInclusionResolver('imagen', this.imagen.inclusionResolver);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
    this.publicacion = this.createBelongsToAccessorFor('publicacion', publicacionRepositoryGetter,);
    this.registerInclusionResolver('publicacion', this.publicacion.inclusionResolver);
  }
}
