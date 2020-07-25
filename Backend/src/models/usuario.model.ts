import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Administrador} from './administrador.model';
import {Comentario} from './comentario.model';
import {Muro} from './muro.model';
import {Publicacion} from './publicacion.model';

@model({settings: {strict: false}})
export class Usuario extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_usuario?: string;

  @property({
    type: 'string',
    required: true,
  })
  primer_nombre: string;

  @property({
    type: 'string',
  })
  segundo_nombre?: string;

  @property({
    type: 'string',
    required: true,
  })
  primer_apellido: string;

  @property({
    type: 'string',
  })
  segundo_apellido?: string;

  @property({
    type: 'number',
    required: true,
  })
  rol: number;

  @property({
    type: 'string',
    required: true,
  })
  nombre_usuario: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
  })
  clave?: string;

  @property({
    type: 'string',
    required: true,
  })
  ciudad: string;

  @property({
    type: 'number',
    required: true,
  })
  celular: number;

  @property({
    type: 'date',
    required: true,
  })
  nacimiento: string;

  @property({
    type: 'string',
    required: true,
  })
  foto: string;

  @property({
    type: 'string',
  })
  genero?: string;

  @hasMany(() => Publicacion)
  publicaciones: Publicacion[];

  @hasMany(() => Comentario, {keyTo: 'id_usuario'})
  comentarios: Comentario[];

  @belongsTo(() => Administrador, {name: 'administradores'})
  administradorId: string;

  @belongsTo(() => Muro)
  muroId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
