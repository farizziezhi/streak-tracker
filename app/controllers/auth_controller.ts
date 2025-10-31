import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const { username, email, password } = request.only(['username', 'email', 'password'])
    
    const user = await User.create({
      username,
      email,
      password
    })

    return response.created({ message: 'User registered successfully', user: { id: user.id, username: user.username, email: user.email } })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({ message: 'Login successful', token: token.value!.release() })
  }
}