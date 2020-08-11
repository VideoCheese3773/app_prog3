import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Denuncia} from './denuncia.model';
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

  @property({
    type: 'string',
  })
  clave?: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @hasMany(() => Publicidad, {keyTo: 'id_administrador'})
  publicidades: Publicidad[];

  @belongsTo(() => Usuario, {name: 'administrador'})
  id_usuario: string;

  @hasMany(() => Denuncia)
  denuncias: Denuncia[];

  constructor(data?: Partial<Administrador>) {
    super(data);
  }
}

export interface AdministradorRelations {
  // describe navigational properties here
}

export type AdministradorWithRelations = Administrador & AdministradorRelations;
