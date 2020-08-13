import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  HttpErrors, oas,
  param,
  Response,
  RestBindings
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {UploadFilesKeys} from '../keys/upload-file-keys';
import {Denuncia, Publicacion, Publicidad, Usuario} from '../models';
import {DenunciaRepository, PublicacionRepository, PublicidadRepository, UsuarioRepository} from '../repositories';

const readdir = promisify(fs.readdir);


export class FileDownloadController {

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

  /**
   *
   * @param type
   * @param id
   */
  @get('/files/{type}', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async listFiles(
    @param.path.number('type') type: number,) {
    const folderPath = this.GetFolderPathByType(type);
    const files = await readdir(folderPath);
    return files;
  }

  /**
   *
   * @param type
   * @param recordId
   * @param response
   */
  @get('/files/{type}/{recordId}')
  @oas.response.file()
  async downloadFile(
    @param.path.number('type') type: number,
    @param.path.string('recordId') recordId: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const folder = this.GetFolderPathByType(type);
    const fileName = await this.GetFilenameById(type, recordId);
    const file = this.ValidateFileName(folder, fileName);
    response.download(file, fileName);
    return response;
  }

  /**
   * Get the folder when files are uploaded by type
   * @param type
   */
  private GetFolderPathByType(type: number) {
    let filePath = '';
    switch (type) {
      // student
      case 1:
        filePath = path.join(__dirname, UploadFilesKeys.USUARIO_PROFILE_PHOTO_PATH);
        break;
      // course
      case 2:
        filePath = path.join(__dirname, UploadFilesKeys.PUBLICIDAD_IMAGE_PATH);
        break;
      // advertising
      case 3:
        filePath = path.join(__dirname, UploadFilesKeys.PUBLICACION_IMAGE_PATH);
        break;
      case 4:
        filePath = path.join(__dirname, UploadFilesKeys.DENUNCIA_IMAGE_PATH);
        break;
    }
    return filePath;
  }

  /**
   *
   * @param type
   */
  private async GetFilenameById(type: number, recordId: string) {
    let fileName = '';
    switch (type) {

      case 1:
        const usuario: Usuario = await this.UsuarioRepository.findById(recordId);
        fileName = usuario.foto ?? '';
        break;

      case 2:
        const publicidad: Publicidad = await this.PublicidadRepository.findById(recordId);
        fileName = publicidad.contenido;
        break;

      case 3:
        const publicacion: Publicacion = await this.PublicacionRepository.findById(recordId);
        fileName = publicacion.image;
        break;
      case 3:
        const denuncia: Denuncia = await this.DenunciaRepository.findById(recordId);
        fileName = denuncia.archivo_prueba;
        break;
    }
    return fileName;
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private ValidateFileName(folder: string, fileName: string) {
    const resolved = path.resolve(folder, fileName);
    if (resolved.startsWith(folder)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors[400](`Invalid file name: ${fileName}`);
  }

}
