import * as Minio from 'minio' // Perubahan di sini
import minioConfig from 'Config/minio'
import Env from '@ioc:Adonis/Core/Env'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

class MinioService {
  private client: Minio.Client
  private bucket: string

  constructor() {
    this.client = new Minio.Client(minioConfig)
    this.bucket = Env.get('MINIO_BUCKET')
  }

  public async upload(file: MultipartFileContract) {
    const fileName = `${cuid()}.${file.extname}`
    const bucketName = this.bucket

    const bucketExists = await this.client.bucketExists(bucketName)
    if (!bucketExists) {
      await this.client.makeBucket(bucketName, 'us-east-1')
    }

    await this.client.fPutObject(bucketName, fileName, file.tmpPath as string, {
      'Content-Type': file.headers['content-type'],
    })

    return fileName
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
