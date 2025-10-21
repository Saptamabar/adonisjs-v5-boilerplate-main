import Env from '@ioc:Adonis/Core/Env'
import { ClientOptions } from 'minio'

const minioConfig: ClientOptions = {
  endPoint: Env.get('MINIO_ENDPOINT'),
  port: Env.get('MINIO_PORT'),
  useSSL: Env.get('MINIO_USE_SSL'),
  accessKey: Env.get('MINIO_ACCESS_KEY'),
  secretKey: Env.get('MINIO_SECRET_KEY'),
}

export default minioConfig
