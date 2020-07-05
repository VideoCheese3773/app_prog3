import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Imagen, ImagenRelations, Publicacion} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PublicacionRepository} from './publicacion.repository';

export class ImagenRepository extends DefaultCrudRepository<
  Imagen,
  typeof Imagen.prototype.id_imagen,
  ImagenRelations
> {

  public readonly imagen: BelongsToAccessor<Publicacion, typeof Imagen.prototype.id_imagen>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('PublicacionRepository') protected publicacionRepositoryGetter: Getter<PublicacionRepository>,
  ) {
    super(Imagen, dataSource);
    this.imagen = this.createBelongsToAccessorFor('imagen', publicacionRepositoryGetter,);
    this.registerInclusionResolver('imagen', this.imagen.inclusionResolver);
  }
}
