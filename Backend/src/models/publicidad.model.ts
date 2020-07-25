import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Administrador} from './administrador.model';
import {Muro} from './muro.model';

@model()
export class Publicidad extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_publicidad?: string;
  @property({
    type: 'string',
    required: true,
  })
  contenido: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha: string;

  @belongsTo(() => Administrador, {name: 'publicidad'})
  id_administrador: string;

  @belongsTo(() => Muro, {name: 'publicidadMuro'})
  id_muro: string;

  constructor(data?: Partial<Publicidad>) {
    super(data);
  }
}

export interface PublicidadRelations {
  // describe navigational properties here
}

export type PublicidadWithRelations = Publicidad & PublicidadRelations;
