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
import {UsuarioRepository} from '../repositories';
import {AuthService} from '../services/auth.service';
import {EncryptDecrypt} from '../services/encrypt-decrypt.service';
import {NotificationService} from '../services/notification.service';

/**
 * El método de restaurar contraseña recibe la clase PasswordResetData,
 * que contiene el nombre de usuario y un tipo de notificación que será
 * enviada por mensaje de texto y por correo electrónico
 */


class Credentials {
  username: string;
  password: string;
}


class PaswordResetData {
  username: string;
  type: number;
}

export class UsuarioController {
  auth: AuthService;
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) {this.auth = new AuthService(usuarioRepository)}

  @post('/login', {
    responses: {
      '200': {
        description: 'Login for users'
      }
    }
  })
  async login(
    @requestBody() credentials: Credentials
  ): Promise<object> {
    let user = await this.auth.Identify(credentials.username, credentials.password);
    if (user) {
      let tk = await this.auth.GenerateToken(user);
      return {
        data: user,
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
      textBody: `Hola ${s.primer_nombre} ${s.primer_apellido}, Se ha creado una cuenta a su nombre, su usuario es su documento de identidad y su contraseña es: ${randomPassword}`,
      htmlBody: `Hola ${s.primer_nombre} ${s.primer_apellido}, <br /> Se ha creado una cuenta a su nombre, su usuario es su documento de identidad y su contraseña es: <strong>${randomPassword}</strong>`,
      to: s.email,
      subject: 'Nueva Cuenta'
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
        description: 'autenticación para usuarios',
      },
    },
  })
  async reset(
    @requestBody() passwordResetData: PaswordResetData
  ): Promise<object> {
    let randomPassword = this.auth.RecuperarContraseña(passwordResetData.username);

    if (randomPassword) {
      //enviar mensaje de texto o correo electrónico con nueva contraseña
      // 1. mensaje de texto
      // 2. correo electrónico

      switch (passwordResetData.type) {
        case 1:
          //seleccionó envio por mensaje de texto
          console.log("enviando mensaje de texto" + randomPassword);
          break;

        case 2:
          // seleccionó envio por correo electrónico
          console.log("enviando correo electrónico " + randomPassword);
          break;

        default:
          break;
      }
    }

    throw new HttpErrors[400]("User not found");

  }



}
