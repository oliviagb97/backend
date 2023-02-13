'use strict';

const readLine = require('readline');

const utils =  {

  askUser(question) {
    return new Promise((resolve) => {
      const rl = readLine.createInterface({
        input: process.stdin, output: process.stdout
      });
      rl.question(question, answer => {
        rl.close();
        resolve(answer);
      });
    });
  },  

  isAPI(req) {
    return req.originalUrl.indexOf('/api') === 0;
  },

  buildAnuncioFilterFromReq(req) {
    const filters = {};
  
    if (typeof req.query.texto !== 'undefined') {
      filters.texto = new RegExp('^' + req.query.texto, 'i');
    }
       
    if (typeof req.query.idUsuario !== 'undefined') {
      filters.idUsuario = req.query.idUsuario;
    }

    if (typeof req.query.usuario !== 'undefined') {
      filters.usuario = new RegExp('^' + req.query.nombre, 'i');
    }

    return filters;
  }, 

  buildUsuarioFilterFromReq(req) {
    const filters = {};
  
    if (typeof req.query.nombre !== 'undefined') {
      filters.nombre = req.query.nombre;
    }
  
    if (typeof req.query.email !== 'undefined') {
      filters.email = req.query.email;
    }

    if (typeof req.query.idUsuario !== 'undefined') {
      filters.idUsuario = req.query.idUsuario;
    }

    return filters;
  }

};

module.exports = utils;