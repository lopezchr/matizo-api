const users = require('../services/Users')
const jwt = require('jwt-simple')

/**
 * Endpoint que resuelve mensaje Hola mundo
 */
exports.login = async function (ctx) {
  let {username, password} = ctx.request.body
  let user = await users.getOneBy({username})
  if (!user) ctx.throw(401)
  if (!users.validatePassword({password, reference: user.password})) ctx.throw(401)

  const payload = {
    iss: 'https://www.asd.com',
    iat: moment().format('X'),
    exp: moment().add(8, 'hours').format('X'),
    sub: user.id
  }

  const token = jwt.encode(payload, process.env.SECRET, 'HS256')
  ctx.body = {
    access_token: token,
    expires_in: 28800
  }
}
