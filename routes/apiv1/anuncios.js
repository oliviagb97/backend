'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Anuncio = mongoose.model('Anuncio');
const { buildAnuncioFilterFromReq } = require('../../lib/utils');

// Return the list of anuncio
router.get('/', (req, res, next) => {

  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id';
  const includeTotal = req.query.includeTotal === 'true';

  const filters = buildAnuncioFilterFromReq(req);

  // Ejemplo hecho con callback, aunque puede hacerse mejor con promesa y await
  Anuncio.list(filters, start, limit, sort, includeTotal, function (err, anuncios) {
    if (err) return next(err);
    res.json({ result: anuncios });
  });
});

// Return the list of available tags
router.get('/tags', asyncHandler(async function (req, res) {
  const distinctTags = await Anuncio.distinct('tags');
  res.json({ result: distinctTags });
}));

// Create
router.post('/', [ // validaciones:
  body('texto' ).isAlphanumeric().withMessage('nombre must be string'),
  body('usuario'  ).isAlphanumeric()     .withMessage('must must be string'),
  body('idUsuario' ).isNumeric()     .withMessage('must be numeric'),
], asyncHandler(async (req, res) => {

  validationResult(req).throw();
  const anuncioData = req.body;

  const anuncio = new Anuncio(anuncioData);
  const anuncioGuardado = await anuncio.save();

  res.json({ result: anuncioGuardado });

}));

module.exports = router;
