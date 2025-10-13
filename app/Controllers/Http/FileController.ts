import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MinioService from 'App/Services/MinioService'

export default class FileController {
  public async upload({ request, response }: HttpContextContract) {
    const file = request.file('file')

    if (!file) {
      return response.badRequest({ message: 'File is required' })
    }

    try {
      const fileName = await MinioService.upload(file)
      const fileUrl = await MinioService.getUrl(fileName)

      return response.ok({
        message: 'File uploaded successfully',
        fileName,
        url: fileUrl,
      })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to upload file', error: error.message })
    }
  }
}
