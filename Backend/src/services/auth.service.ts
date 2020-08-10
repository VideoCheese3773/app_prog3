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
   * Verify if cureent password belongs to user
   * @param id id of user to verify
   * @param clave current password
   */
  async VerifyUserToChangePassword(id: string, clave: string): Promise<Usuario | false> {
    console.log(`Username: ${id} - Password: ${clave}`);
    let user = await this.UsuarioRepository.findById(id);
    if (user) {
      let cryptPass = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD).Encrypt(clave);
      if (user.clave == cryptPass) {
        return user;
      }
    }
    return false;
  }

  /**
   *
   * @param id user id to update passowrd
   * @param clave new password
   */
  async ChangePassword(id: string, clave: string): Promise<Boolean> {
    //console.log(`Username: ${username} - Password: ${password}`);
    let user = await this.UsuarioRepository.findById(id);
    if (user) {
      let cryptPass = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD).Encrypt(clave);
      let cryptPass2 = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD).Encrypt(cryptPass);
      user.clave = cryptPass2;
      await this.UsuarioRepository.updateById(id, user);
      return true;
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

  /**
   * Reset the user password when it is missed
   * @param username
   */
  async ResetPassword(nombre_usuario: string): Promise<string | false> {
    let user = await this.UsuarioRepository.findOne({where: {nombre_usuario: nombre_usuario}});
    if (user) {
      let randomPassword = generator({
        length: passKeys.LENGTH,
        numbers: passKeys.NUMBERS,
        lowercase: passKeys.LOWERCASE,
        uppercase: passKeys.UPPERCASE
      });
      let crypter = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD);
      let password = crypter.Encrypt(crypter.Encrypt(randomPassword));
      user.clave = password;
      this.UsuarioRepository.replaceById(user.id_usuario, user);
      return randomPassword;
    }
    return false;
  }

}
