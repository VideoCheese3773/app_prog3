import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Publicacion} from './publicacion.model';

@model({settings: {strict: false}})
export class Denuncia extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_denuncia?: string;

  @property({
    type: 'string',
    required: true,
  })
  archivo_prueba: string;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha: string;

  @belongsTo(() => Publicacion)
  publicacionId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Denuncia>) {
    super(data);
  }
}

export interface DenunciaRelations {
  // describe navigational properties here
}

export type DenunciaWithRelations = Denuncia & DenunciaRelations;
