import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors, param, post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {UploadFilesKeys} from '../keys/upload-file-keys';
import {Publicacion, Publicidad, Usuario} from '../models';
import {DenunciaRepository, PublicacionRepository, PublicidadRepository, UsuarioRepository} from '../repositories';


/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {


  constructor(
    @repository(DenunciaRepository)
    private DenunciaRepository: DenunciaRepository,
    @repository(UsuarioRepository)
    private UsuarioRepository: UsuarioRepository,
    @repository(PublicacionRepository)
    private PublicacionRepository: PublicacionRepository,
    @repository(PublicidadRepository)
    private PublicidadRepository: PublicidadRepository,
  ) {}


  @post('/foto-perfil', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Usuario Photo',
      },
    },
  })
  async UsuarioPhotoUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.string('id_usuario') id_usuario: string,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const UsuarioPhotoPath = path.join(__dirname, UploadFilesKeys.USUARIO_PROFILE_PHOTO_PATH);
    let res = await this.StoreFileToPath(UsuarioPhotoPath, UploadFilesKeys.USUARIO_PROFILE_PHOTO_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        let c: Usuario = await this.UsuarioRepository.findById(id_usuario);
        if (c) {
          c.foto = filename;
          this.UsuarioRepository.replaceById(id_usuario, c);
          return {filename: filename};
        }
      }
    }
    return res;
  }

  @post('/archivodenuncia', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: ' foto denuncia',
      },
    },
  })
  async DenunuciaPhotoUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.string('id_denuncia') id_denuncia: string,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const DenunciaPhotoPath = path.join(__dirname, UploadFilesKeys.DENUNCIA_IMAGE_PATH);
    let res = await this.StoreFileToPath(DenunciaPhotoPath, UploadFilesKeys.DENUNCIA_IMAGE_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename: filename};
      }
    }
    return res;
  }


  @post('/PublicidadImagen', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Publicidad Imagen',
      },
    },
  })
  async PublicidadImagenUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.string('id_publicidad') id_publicidad: string,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const PublicidadImagenPath = path.join(__dirname, UploadFilesKeys.PUBLICIDAD_IMAGE_PATH);
    let res = await this.StoreFileToPath(PublicidadImagenPath, UploadFilesKeys.PUBLICACION_IMAGE_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        let c: Publicidad = await this.PublicidadRepository.findById(id_publicidad);
        if (c) {
          c.contenido = filename;
          this.PublicidadRepository.replaceById(id_publicidad, c);
          return {filename: filename};
        }
      }
    }
    return res;
  }


  @post('/PublicacionImagen', {
    responses: {
      200: {
        content: {
          'application/json': {
          },
        },
        description: 'Publicacion Imagen',
      },
    },
  })
  async PublicacionImagenUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.string('id_publicacion') id_publicacion: typeof Publicacion.prototype.id_publicacion,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const PublicacionPath = path.join(__dirname, UploadFilesKeys.PUBLICACION_IMAGE_PATH);
    let res = await this.StoreFileToPath(PublicacionPath, UploadFilesKeys.PUBLICACION_IMAGE_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        let c: Publicacion = await this.PublicacionRepository.findById(id_publicacion);
        if (c) {
          c.imagen = filename;
          this.PublicacionRepository.replaceById(id_publicacion, c);
          return {filename: filename};
        }
      }
    }
    return res;
  }
  /**
   * store the file in a specific path
   * @param storePath
   * @param request
   * @param response
   */
  private StoreFileToPath(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[]) {
    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
          var ext = path.extname(file.originalname).toUpperCase();
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(new HttpErrors[400]('This format file is not supported.'));
        },
        limits: {
          fileSize: UploadFilesKeys.MAX_FILE_SIZE
        }
      },
      ).single(fieldname);
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  /**
   * Return a config for multer storage
   * @param path
   */
  private GetMulterStorageConfig(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path)
      },
      filename: function (req, file, cb) {
        filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
      }
    });
    return storage;
  }
}
