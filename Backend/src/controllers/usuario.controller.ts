import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef,
  HttpErrors, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import {generate} from 'generate-password';
import {PasswordKeys} from '../keys/password-keys';
import {ServiceKeys as keys} from '../keys/service-keys';
import {Usuario} from '../models';
import {EmailNotification} from '../models/email-notification.model';
import {SmsNotification} from '../models/sms-notification.model';
import {AdministradorRepository, UsuarioRepository} from '../repositories';
import {AuthService} from '../services/auth.service';
import {EncryptDecrypt} from '../services/encrypt-decrypt.service';
import {NotificationService} from '../services/notification.service';

/**
 * El método de restaurar contraseña recibe la clase PasswordResetData,
 * que contiene el nombre de usuario y un tipo de notificación que será
 * enviada por mensaje de texto y por correo electrónico
 */

class ChangePasswordData {
  id: string;
  clave_actual: string;
  clave_nueva: string;
}
class Credentials {
  nombre_usuario: string;
  clave: string;
}


class PasswordResetData {
  nombre_usuario: string;
  tipo: number;
}

export class UsuarioController {
  auth: AuthService;
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(AdministradorRepository)
    public administradorRepository: AdministradorRepository,
  ) {this.auth = new AuthService(usuarioRepository, administradorRepository)}

  @post('/login-usuario', {
    responses: {
      '200': {
        description: 'Login for users'
      }
    }
  })
  async login(
    @requestBody() credentials: Credentials
  ): Promise<object> {
    console.log(`Username: ${credentials.nombre_usuario} - Password: ${credentials.clave}`);
    let usuario = await this.auth.Identify(credentials.nombre_usuario, credentials.clave);
    if (usuario) {
      let tk = await this.auth.GenerateToken(usuario);
      return {
        data: usuario,
        token: tk
      }
    } else {
      throw new HttpErrors[401]("User or Password invalid.");
    }
  }



  @post('/usuarios', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id_usuario'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id_usuario'>,
  ): Promise<Usuario> {

    let randomPassword = generate({
      length: PasswordKeys.LENGTH,
      numbers: PasswordKeys.NUMBERS,
      lowercase: PasswordKeys.LOWERCASE,
      uppercase: PasswordKeys.UPPERCASE
    });
    console.log(randomPassword)
    let password1 = new EncryptDecrypt(keys.MD5).Encrypt(randomPassword);
    let password2 = new EncryptDecrypt(keys.MD5).Encrypt(password1);
    usuario.clave = password2
    let s = await this.usuarioRepository.create(usuario);

    let notification = new EmailNotification({
      textBody: `Hola ${s.primer_nombre} ${s.primer_apellido}, Se ha creado una cuenta a su nombre en la version experimental de la red social de apuestas BETWHERE, su usuario es ${s.nombre_usuario} y su contraseña es: ${randomPassword}`,
      htmlBody: `Hola ${s.primer_nombre} ${s.primer_apellido}, <br /> Se ha creado una cuenta a su nombre en la version experimental de la red social de apuestas BETWHERE, su usuario es ${s.nombre_usuario} y su contraseña es: <strong>${randomPassword}</strong>`,
      to: s.correo,
      subject: 'Nueva Cuenta --> BETWHERE'
    });
    await new NotificationService().MailNotification(notification);
    return s;
  }

  @get('/usuarios/count', {
    responses: {
      '200': {
        description: 'Usuario model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios', {
    responses: {
      '200': {
        description: 'Array of Usuario model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Usuario, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios', {
    responses: {
      '200': {
        description: 'Usuario PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Usuario, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}', {
    responses: {
      '204': {
        description: 'Usuario PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}', {
    responses: {
      '204': {
        description: 'Usuario PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}', {
    responses: {
      '204': {
        description: 'Usuario DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }


  @post('/password-reset', {
    responses: {
      '200': {
        description: 'Login for users'
      }
    }
  })
  async reset(
    @requestBody() passwordResetData: PasswordResetData
  ): Promise<boolean> {
    let randomPassword = await this.auth.ResetPassword(passwordResetData.nombre_usuario);

    if (randomPassword) {
      // send sms or mail with new password
      // 1. SMS
      // 2. Mail
      // ....
      let usuario = await this.usuarioRepository.findOne({where: {nombre_usuario: passwordResetData.nombre_usuario}})
      switch (passwordResetData.tipo) {
        case 1:
          if (usuario) {
            let notification = new SmsNotification({
              body: `Su nueva contraseña es: ${randomPassword}`,
              to: usuario.celular
            });
            let sms = await new NotificationService().SmsNotification(notification);
            if (sms) {
              return true
            }
            throw new HttpErrors[400]("Phone is not found");
          }
          throw new HttpErrors[400]("user not found");

          break;
        case 2:
          // send mail
          if (usuario) {
            let notification = new EmailNotification({
              textBody: `Su nueva contraseña es: ${randomPassword}`,
              htmlBody: `Su nueva contraseña es: ${randomPassword}`,
              to: usuario.correo,
              subject: 'Nueva contraseña'
            });
            let mail = await new NotificationService().MailNotification(notification);
            if (mail) {
              return true
            }
            throw new HttpErrors[400]("Email is not found");
          }
          throw new HttpErrors[400]("User not found");
          break;

        default:
          throw new HttpErrors[400]("This notification type is not supported.");
          break;
      }
    }
    throw new HttpErrors[400]("User not found");
  }


  @post('/change-password', {
    responses: {
      '200': {
        description: 'Login for users'
      }
    }
  })
  async changePassword(
    @requestBody() changePasswordData: ChangePasswordData
  ): Promise<Boolean> {
    let user = await this.auth.VerifyUserToChangePassword(changePasswordData.id, changePasswordData.clave_actual);
    if (user) {
      return await this.auth.ChangePassword(changePasswordData.id, changePasswordData.clave_nueva);
    }
    throw new HttpErrors[400]("User not found");
  }


}
