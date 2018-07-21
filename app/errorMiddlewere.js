const {errors} = require('../services/ServiceError/lang_es')
const moment = require('moment')

module.exports = async function (ctx, next) {
  try {
    console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`, ctx.method, ctx.path, ctx.query, ctx.request.body)
    await next();
    console.log(ctx.body)
  } catch (err) {
    if (err.code && errors[err.code]) {
      ctx.status = 400
      ctx.body = {description: errors[err.code], code: err.code, info: err.info}
    } else {
      console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`, ctx.method, ctx.path, ctx.query, ctx.request.body, err)
      ctx.status = err.status || 500
      switch (err.status) {
        case 403:
          ctx.body = 'Permiso denegado para relizar esta acción'
          break
        case 401:
          ctx.body = 'Unauthorized'
          break
        default:
          ctx.body = 'Lo sentimos ha ocurrido un error'
          break
      }
    }
  }
}