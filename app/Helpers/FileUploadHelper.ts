import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import MinioService from 'App/Services/MinioService'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Env from '@ioc:Adonis/Core/Env'

export async function handleFileUpload(
  payload: Record<string, any>,
  data: Record<string, any>,
  fields: string[],
  prefixMap: Record<string, string>,
  instance?: InstanceType<typeof BaseModel> | null
) {
  for (const field of fields) {
    const file = payload[field] as MultipartFileContract | undefined
    const specificPrefix = prefixMap[field]
    if (file && typeof file.move === 'function' && specificPrefix) {
      const urlField = `${field}_url`

      if (instance && (instance as any)[urlField]) {
        try {
          const oldUrl = (instance as any)[urlField]
          const urlObject = new URL(oldUrl)
          const pathParts = urlObject.pathname.split('/').filter(p => p)
          const bucketName = Env.get('MINIO_BUCKET')
          const bucketIndex = pathParts.indexOf(bucketName)

          if (bucketIndex !== -1) {
            const oldObjectKey = pathParts.slice(bucketIndex + 1).join('/')
            await MinioService.delete(oldObjectKey)
          }

        } catch (deleteError) {
          console.error(`Failed to delete old file for field '${field}':`, deleteError.message)
        }
      }

      const fileName = await MinioService.upload(file, specificPrefix)
      data[urlField] = await MinioService.getUrl(fileName)
    }
  }
}
