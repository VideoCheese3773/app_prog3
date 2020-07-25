import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Publicacion} from './publicacion.model';
import {Usuario} from './usuario.model';
import {Imagen} from './imagen.model';

@model({settings: {strict: false}})
export class Comentario extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_comentario?: string;

  @property({
    type: 'string',
    required: true,
  })
  texto: string;

  @property({
    type: 'number',
    required: true,
  })
  me_gusta: number;

  @property({
    type: 'number',
    required: true,
  })
  no_gusta: number;

  @property({
    type: 'date',
    required: true,
  })
  fecha: string;

  @property({
    type: 'string',
  })
  id_usuario?: string;

  @belongsTo(() => Publicacion)
  publicacionId: string;

  @belongsTo(() => Usuario)
  usuarioId: string;

  @belongsTo(() => Imagen)
  imagenId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Comentario>) {
    super(data);
  }
}

export interface ComentarioRelations {
  // describe navigational properties here
}

export type ComentarioWithRelations = Comentario & ComentarioRelations;
