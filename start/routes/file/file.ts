import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/upload', 'FileController.upload')
}).prefix('file').middleware('auth')
