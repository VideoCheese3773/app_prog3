/**
 * Importación de paquetes y otras entidades
 */
import {repository} from '@loopback/repository';
import {generate as generator} from 'generate-password';
import {PasswordKeys as passKeys} from '../keys/password-keys';
import {ServiceKeys as keys} from '../keys/service-keys';
import {Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {EncryptDecrypt} from './encrypt-decrypt.service';
const jwt = require("jsonwebtoken");

/**
 * clase de autenticación
 */

export class AuthService {
  constructor(@repository(UsuarioRepository)
  public UsuarioRepository: UsuarioRepository
  ) {

  }

  /**
   * Método para recuperar la contraseña
   * @param username
   * @param password
   */
  async Identify(username: string, password: string): Promise<Usuario | false> {
    console.log(`Username: ${username} - Password: ${password}`);
    let user = await this.UsuarioRepository.findOne({where: {username: username}});
    if (user) {
      let cryptPass = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD).Encrypt(password);
      if (user.password == cryptPass) {
        return user;
      }
    }
    return false;
  }

  /**
   *
   * @param user
   */
  async GenerateToken(user: Usuario) {
    user.password = '';
    let token = jwt.sign({
      exp: keys.TOKEN_EXPIRATION_TIME,
      data: {
        _id: user.id,
        username: user.username,
        role: user.role,
        paternId: user.studentId
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
