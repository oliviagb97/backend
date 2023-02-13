'use strict';

const mongoose = require('mongoose');
const fsPromises = require('fs').promises;
const configusuarios = require('../local_config').usuarios;
const path = require('path');

const usuarioSchema = mongoose.Schema({
  nombre: { type: String, index: true },
  idUsuario: { type: Number, index: true },
  password: { type: String, index: true },
  email: { type: String, index: true },
  foto: String,  
});

/**
 * carga un json de usuarios
 */
usuarioSchema.statics.cargaJson = async function (fichero) {

  const data = await fsPromises.readFile(fichero, { encoding: 'utf8' });

  // Ejemplo de usar una función que necesita callback con async/await
  // const data = await new Promise((resolve, reject) => {
  //   // Encodings: https://nodejs.org/api/buffer.html
  //   fs.readFile(fichero, { encoding: 'utf8' }, (err, data) => {
  //     return err ? reject(err) : resolve(data);
  //   });
  // });

  if (!data) {
    throw new Error(fichero + ' está vacio!');
  }

  const usuarios = JSON.parse(data).usuarios;
  const numusuarios = usuarios.length;

  for (var i = 0; i < usuarios.length; i++) {
    await (new usuario(usuarios[i])).save();
  }

  return numusuarios;

};

usuarioSchema.statics.list = async function(filters, startRow, numRows, sortField, includeTotal, cb) {

  const query = usuario.find(filters);
  query.sort(sortField);
  query.skip(startRow);
  query.limit(numRows);
  //query.select('nombre venta');

  const result = {};

  if (includeTotal) {
    result.total = await usuario.countDocuments();
  }
  result.rows = await query.exec();

  // poner ruta base a imagenes
  const ruta = configusuarios.imagesURLBasePath;
  result.rows.forEach(r => r.foto = r.foto ? path.join(ruta, r.foto) : null );

  if (cb) return cb(null, result); // si me dan callback devuelvo los resultados por ahí
  return result; // si no, los devuelvo por la promesa del async (async está en la primera linea de esta función)
};

var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
