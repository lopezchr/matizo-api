const Router= require('koa-router')

const defaultController = require('./DefaultController')

/**
 * Asignacion de rutas e inicializacion de instancias de controladores
 * @param  {Object} app Instancia de koa
 * @return {Instance}     Instancia de enrutador
 * @author Christian Lopez
 */
module.exports = function (app) {
  const router = new Router();

  /**
   * Las rutas se arman basandose en la especificacion REST teniendo en cuenta
   * que se usaran para un aplicacion tipo API y en ocaciones es necesario unsar
   * peticiones tipo ad hoc
   */

  router.get('/', defaultController.home)
  
  app.context.router = router
  return router
}

/**
 * Middleware que verifica proceso de authorizacion con resultado simple
 * @param  {Object}   ctx  Contexto de la aplicacion
 * @param  {function} next Siguiente middleware
 */
async function securityBasic (ctx, next) {
  if (!ctx.state.isAuthenticated) {
    ctx.throw(401, ctx.state.errorDescription)
  }

  await next()
}
