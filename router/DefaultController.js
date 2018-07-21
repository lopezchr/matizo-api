/**
 * Endpoint que resuelve mensaje Hola mundo
 * @param  {Object} ctx Contexto de la aplicacion
 * @author Christian Lopez
 */
exports.home = async function (ctx) {
  ctx.body = `hola mundo`
}