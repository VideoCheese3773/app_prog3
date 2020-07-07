/**
 * importación de servicios y entidades para cifrar los datos
 */
const CryptoJS=require('crypto-js');
import {ServiceKeys as keys} from '../keys/service-keys';

/**
 * La clase usada para encriptar recibe como parámetro un 
 * texto para su funcionamiento
 */

export class EncryptDecrypt{
    type: string;
    constructor(type:string){
        this.type=type;
    }
    
    /**
     * diferentes algoritmos para encriptar y desencriptar los datos
     * @param text 
     */
    Encrypt(text:string){
        switch (this.type) {
            case keys.MD5:
                return CryptoJS.MD5(text).toString();
                
                break;

            case keys.AES:

                return CryptoJS.AES(text,keys.AES_SECRET_KEY).toString();
                
                break;
            
            case keys.SHA_512:

                break;

            default:

                return "este tipo de crypto no se encuentra soportado";
            break;
        }
    }
}