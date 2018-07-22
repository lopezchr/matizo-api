const jwt = require('jwt-simple')
const moment = require('moment')

/**
 * Middleware para el manejo del token JWT
 * @author Christian Lopez
 */
module.exports = async function (ctx, next) {
  let token 
  if (ctx.headers.authorization && ctx.headers.authorization.split(' ')[0] === 'Bearer') {
    token =  ctx.headers.authorization.split(' ')[1]
  } else if (ctx.cookies.get(process.env.COOKIE_KEY)) {
    token =  ctx.cookies.get(process.env.COOKIE_KEY)
  }

  if (token) {
    try {
      let payload = jwt.decode(token, process.env.SECRET)
      ctx.state.payload = payload
      ctx.state.token = token
      let userReference = String(payload.sub).split('|')
      if(userReference[0] == 'client'){
        ctx.state.client = {company: userReference[1]}  
        ctx.state.isAuthenticated = true
      } else { // usuarios 
        let user = await ctx.services.users.getUserData(payload.sub)
        if (user) {
          ctx.state.isAuthenticated = true
          ctx.state.user = user
        }
      } 
    } catch (e) {
      ctx.state.errorDescription = 'Error verificando el token'
    }
  }

  await next()
}