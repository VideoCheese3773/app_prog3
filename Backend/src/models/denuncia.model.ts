import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Administrador} from './administrador.model';
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
    type: 'string',
    required: true,
  })
  fecha: string;

  @property({
    type: 'string',
    required: true,
  })
  resuelto?: string;

  @belongsTo(() => Publicacion, {name: 'publicacion'})
  publicacionId: string;

  @belongsTo(() => Administrador, {name: 'administrador'})
  administradorId: string;
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
