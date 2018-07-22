const db = require('./Database')
const ServiceError = require('./ServiceError')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

const CIPHER_METHOD = 'aes-128-cbc'
const CIPHER_KEY = 'e0535s5c6cea965b'
const CIPHER_IV = 'e05d5etcuced4s5d'

/**
 * optiene un usuario por nombre de usuario o id
 */
exports.getOneBy = async function ({username, userId}) {
  if (username) {
    let user = await db('users').where({username}).first()
    return user
  }

  if (userId) {
    let user = await db('users').where({id: userId}).first()
    return user
  }

  throw new ServiceError("101")
}

/**
 * Metodo que valida la contraseña ingresada contra el hash bcrypt 
 * y que fue cifrado en la base de datos
 */
exports.validatePassword = async function ({password, reference}) {
  let decipher = crypto.createDecipheriv(CIPHER_METHOD, CIPHER_KEY, CIPHER_IV);
  let hash = decipher.update(reference,'base64','utf8');
  hash += decipher.final('utf8');

  return bcrypt.compareSync(password, hash)
}

/**
 * Metodo que cambia el password de un usuario
 */
exports.changePassword = async function ({userId, password}) {
  let hash = bcrypt.hashSync(password)
  let cipher = crypto.createCipheriv(CIPHER_METHOD, CIPHER_KEY, CIPHER_IV)
  let crypted = cipher.update(hash, 'utf8', 'base64')
  crypted += cipher.final('base64');

  await db('usuarios').update({
    hash: crypted
  }).where('id', userId)

  return true
}
