import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Publicidad} from './publicidad.model';
import {Usuario} from './usuario.model';

@model()
export class Administrador extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  rol: number;
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_administrador?: string;

  @hasMany(() => Publicidad, {keyTo: 'id_administrador'})
  publicidades: Publicidad[];

  @belongsTo(() => Usuario, {name: 'administrador'})
  id_usuario: string;

  constructor(data?: Partial<Administrador>) {
    super(data);
  }
}

export interface AdministradorRelations {
  // describe navigational properties here
}

export type AdministradorWithRelations = Administrador & AdministradorRelations;
