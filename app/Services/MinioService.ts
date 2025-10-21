import * as Minio from 'minio'
import minioConfig from 'Config/minio'
import Env from '@ioc:Adonis/Core/Env'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

class MinioService {
  private client: Minio.Client
  private bucket: string

constructor() {
    this.client = new Minio.Client(minioConfig)
    this.bucket = Env.get('MINIO_BUCKET')
  }

  public async upload(file: MultipartFileContract, prefixDir?: string) {
    const bucketName = this.bucket
    const modulePrefix = prefixDir?.replace(/\//g, '-') || 'file'

    const originalNameWithoutExt = file.clientName.substring(0, file.clientName.lastIndexOf('.')) || file.clientName
    const sanitizedOriginalName = originalNameWithoutExt
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

   const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const Timestamp = `${year}-${month}-${day}-${hours}${minutes}${seconds}`;

    const newFileName = `${modulePrefix}-${sanitizedOriginalName}-${Timestamp}.${file.extname}`;

    const objectKey = prefixDir ? `${prefixDir}/${newFileName}` : newFileName

    const bucketExists = await this.client.bucketExists(bucketName)
    if (!bucketExists) {
      await this.client.makeBucket(bucketName, 'us-east-1')
    }

    await this.client.fPutObject(bucketName, objectKey, file.tmpPath as string, {
      'Content-Type': file.headers['content-type'],
    })


    return objectKey
  }

  public async getUrl(fileName: string) {
    const bucketName = this.bucket
    return this.client.presignedGetObject(bucketName, fileName, 24 * 60 * 60)
  }

  public async delete(fileName: string) {
    const bucketName = this.bucket
    await this.client.removeObject(bucketName, fileName)
  }
}

export default new MinioService()
