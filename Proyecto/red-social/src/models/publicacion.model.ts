import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Publicacion extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_publicacion?: string;

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
    type: 'boolean',
    required: true,
  })
  compartido: boolean;

  @property({
    type: 'date',
    required: true,
  })
  fecha: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Publicacion>) {
    super(data);
  }
}

export interface PublicacionRelations {
  // describe navigational properties here
}

export type PublicacionWithRelations = Publicacion & PublicacionRelations;
