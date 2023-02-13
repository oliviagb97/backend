'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Usuario = mongoose.model('Usuario');
const { buildUsuarioFilterFromReq } = require('../../lib/utils');

// Return the list of usuario
router.get('/', (req, res, next) => {

  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id';
  const includeTotal = req.query.includeTotal === 'true';

  const filters = buildUsuarioFilterFromReq(req);

  // Ejemplo hecho con callback, aunque puede hacerse mejor con promesa y await
  Usuario.list(filters, start, limit, sort, includeTotal, function (err, usuarios) {
    if (err) return next(err);
    res.json({ result: usuarios });
  });
});

// Create
router.post('/', [ // validaciones:
  body('nombre' ).isAlphanumeric().withMessage('nombre must be string'),
  body('password'  ).isAlphanumeric().withMessage('password must be string'),
  body('email' ).isEmail().withMessage('must be a email address'),
], asyncHandler(async (req, res) => {

  validationResult(req).throw();
  const usuarioData = req.body;

  const usuario = new Usuario(usuarioData);
  const usuarioGuardado = await usuario.save();

  res.json({ result: usuarioGuardado });

}));

module.exports = router;
