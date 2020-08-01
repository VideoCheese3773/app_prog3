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
import {Imagen, Publicacion, Usuario} from '../models';
import {ImagenRepository, PublicidadRepository, UsuarioRepository} from '../repositories';


/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {

  /**
   *
   * @param UsuarioRepository
   * @param ImagenRepository
   * @param PublicidadRepository
   */
  constructor(
    @repository(UsuarioRepository)
    private UsuarioRepository: UsuarioRepository,
    @repository(ImagenRepository)
    private ImagenRepository: ImagenRepository,
    @repository(PublicidadRepository)
    private PublicidadRepository: PublicidadRepository,
  ) {}

  /**
   * Add or replace the profile photo of a Usuario by UsuarioId
   * @param request
   * @param UsuarioId
   * @param response
   */
  @post('/UsuarioProfilePhoto', {
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
    @param.query.string('UsuarioId') UsuarioId: string,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const UsuarioPhotoPath = path.join(__dirname, UploadFilesKeys.USUARIO_PROFILE_PHOTO_PATH);
    let res = await this.StoreFileToPath(UsuarioPhotoPath, UploadFilesKeys.USUARIO_PROFILE_PHOTO_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        let c: Usuario = await this.UsuarioRepository.findById(UsuarioId);
        if (c) {
          c.foto = filename;
          this.UsuarioRepository.replaceById(UsuarioId, c);
          return {filename: filename};
        }
      }
    }
    return res;
  }

  /**
   *
   * @param response
   * @param PublicidadId
   * @param request
   */
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
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const PublicidadImagenPath = path.join(__dirname, UploadFilesKeys.PUBLICIDAD_IMAGE_PATH);
    let res = await this.StoreFileToPath(PublicidadImagenPath, UploadFilesKeys.USUARIO_PROFILE_PHOTO_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename: filename};
      }
    }
    return res;
  }

  /**
   * Add a new Imagen or replace another one that exists of a Publicacion
   * @param request
   * @param response
   * @param PublicacionId
   * @param ImagenId if this parameter is empty then the Imagens will be added, on the contrary it will be replaced
   */
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
    @param.query.string('PublicacionId') PublicacionId: typeof Publicacion.prototype.id_publicacion,
    @param.query.number('order') order: number,
    @param.query.string('ImagenId') ImagenId: typeof Imagen.prototype.id_imagen,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const PublicacionPath = path.join(__dirname, UploadFilesKeys.PUBLICACION_IMAGE_PATH);
    let res = await this.StoreFileToPath(PublicacionPath, UploadFilesKeys.PUBLICACION_IMAGE_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        let img: Imagen;
        if (ImagenId) {
          img = await this.ImagenRepository.findById(ImagenId);
          img.ruta = filename;
          img.order = order;
          await this.ImagenRepository.replaceById(ImagenId, img);
        } else {
          img = new Imagen({
            ruta: filename,
            order: order,
            id_publicacion: PublicacionId ?? ''
          });
          await this.ImagenRepository.create(img);
        }
        return {filename: filename};
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
