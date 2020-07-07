/**
 * Importación de paquetes y otras entidades 
 */
import { UsuarioRepository } from '../repositories/usuario.repository';
import {PasswordKeys as passkeys} from '../keys/password-keys';
import { repository } from '@loopback/repository';
import {generate as generator} from 'generate-password';
import { EncryptDecrypt } from './encrypt-decrypt.service';

/**
 * clase de autenticación 
 */

export class AuthService{
    constructor(@repository(UsuarioRepository)
                public UsuarioRepository:UsuarioRepository
        ){

        }

/**
 * Método para recuperar la contraseña 
 * @param username 
 */

async RecuperarContraseña(username:string): Promise<string | false>{
   let usuario= await this.UsuarioRepository.findOne({where:{correo:username}});
   if (usuario){
        let randomPassword =generator({
            length: passkeys.LENGTH,
            numbers: passkeys.NUMBERS,
            lowercase: passkeys.LOWERCASE,
            uppercase:passkeys.UPPERCASE

        });
        let crypter= new EncryptDecrypt('asifhufehu');
        let password= crypter.Encrypt(crypter.Encrypt(randomPassword));
        usuario.clave=password;
        this.UsuarioRepository.replaceById(usuario.id_usuario,usuario);
        return randomPassword;
   }
    
   return false;
}

}