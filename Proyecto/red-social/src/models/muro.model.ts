import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Usuario} from './usuario.model';

@model()
export class Muro extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_muro?: string;

  @belongsTo(() => Usuario, {name: 'muro'})
  id_usuario: string;

  constructor(data?: Partial<Muro>) {
    super(data);
  }
}

export interface MuroRelations {
  // describe navigational properties here
}

export type MuroWithRelations = Muro & MuroRelations;
