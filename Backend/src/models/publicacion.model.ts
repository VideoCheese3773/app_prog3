import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Usuario} from './usuario.model';
import {Muro} from './muro.model';
import {Denuncia} from './denuncia.model';
import {Comentario} from './comentario.model';

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

  @belongsTo(() => Usuario)
  usuarioId: string;

  @belongsTo(() => Muro)
  muroId: string;

  @hasMany(() => Denuncia)
  denuncias: Denuncia[];

  @hasMany(() => Comentario)
  comentarios: Comentario[];
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
