/**
 * Importación de paquetes y otras entidades
 */
import {repository} from '@loopback/repository';
import {generate as generator} from 'generate-password';
import {PasswordKeys as passKeys} from '../keys/password-keys';
import {ServiceKeys as keys} from '../keys/service-keys';
import {Administrador, Usuario} from '../models';
import {AdministradorRepository, UsuarioRepository} from '../repositories';
import {EncryptDecrypt} from './encrypt-decrypt.service';
const jwt = require("jsonwebtoken");

/**
 * clase de autenticación
 */

export class AuthService {
  constructor(
    @repository(UsuarioRepository)
    public UsuarioRepository: UsuarioRepository,
    @repository(AdministradorRepository)
    public AdministradorRepository: AdministradorRepository
  ) {

  }

  /**
   * Método para recuperar la contraseña
   * @param username
   * @param password
   */
  async Identify(nombre_usuario: string, clave: string): Promise<Usuario | false> {
    let user = await this.UsuarioRepository.findOne({where: {nombre_usuario: nombre_usuario}});
    if (user) {
      let cryptPass = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD).Encrypt(clave);
      console.log(`Username: ${nombre_usuario} - Password: ${clave}`);
      if (user.clave == cryptPass) {
        return user;
      }
    }
    return false;
  }

  async Identifyadmin(correo: string, clave: string): Promise<Administrador | false> {
    let admin = await this.AdministradorRepository.findOne({where: {correo: correo}});
    if (admin) {
      let cryptPass = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD).Encrypt(clave);
      console.log(`Username: ${correo} - Password: ${clave}`);
      if (admin.clave == cryptPass) {
        return admin;
      }
    }
    return false;
  }

  /**
   *
   * @param user
   */
  async GenerateToken(user: Usuario) {
    user.clave = '';
    let token = jwt.sign({
      exp: keys.TOKEN_EXPIRATION_TIME,
      data: {
        id: user.id_usuario,
        username: user.nombre_usuario,
        role: user.rol,
      }
    },
      keys.JWT_SECRET_KEY);
    return token;
  }
  /**
 *
 * @param admin
 */
  async GenerateTokenadmin(admin: Administrador) {
    admin.clave = '';
    let token = jwt.sign({
      exp: keys.TOKEN_EXPIRATION_TIME,
      data: {
        id: admin.id_administrador,
        username: admin.correo,
        role: admin.rol,
      }
    },
      keys.JWT_SECRET_KEY);
    return token;
  }

  /**
   * To verify a given token
   * @param token
   */
  async VerifyToken(token: string) {
    try {
      let data = jwt.verify(token, keys.JWT_SECRET_KEY).data;
      return data;
    } catch (error) {
      return false;
    }
  }

  async RecuperarContraseña(username: string): Promise<string | false> {
    let usuario = await this.UsuarioRepository.findOne({where: {correo: username}});
    if (usuario) {
      let randomPassword = generator({
        length: passKeys.LENGTH,
        numbers: passKeys.NUMBERS,
        lowercase: passKeys.LOWERCASE,
        uppercase: passKeys.UPPERCASE

      });
      let crypter = new EncryptDecrypt('asifhufehu');
      let password = crypter.Encrypt(crypter.Encrypt(randomPassword));
      usuario.clave = password;
      this.UsuarioRepository.replaceById(usuario.id_usuario, usuario);
      return randomPassword;
    }

    return false;
  }

}
