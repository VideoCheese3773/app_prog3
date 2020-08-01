import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Publicacion} from './publicacion.model';

@model()
export class Imagen extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_imagen?: string;

  @property({
    type: 'string',
    required: true,
  })
  ruta: string;

  @property({
    type: 'string',
  })
  descripcion?: string;

  @property({
    type: 'string',
  })
  titulo?: string;

  @property({
    type: 'number',
    required: true,
  })
  order: number;

  @belongsTo(() => Publicacion, {name: 'imagen'})
  id_publicacion: string;

  constructor(data?: Partial<Imagen>) {
    super(data);
  }
}

export interface ImagenRelations {
  // describe navigational properties here
}

export type ImagenWithRelations = Imagen & ImagenRelations;
