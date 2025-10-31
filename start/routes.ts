/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import app from '@adonisjs/core/services/app'

// Serve frontend
router.get('/', async ({ response }) => {
  return response.download(app.publicPath('index.html'))
})

router.get('/app.js', async ({ response }) => {
  return response.download(app.publicPath('app.js'))
})

// Auth routes
router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')

// Streak routes
router.post('/streaks', '#controllers/streaks_controller.store').use(middleware.auth())
router.get('/streaks/public', '#controllers/streaks_controller.public')
