'use strict';

const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const Usuario = require('mongoose').model('Usuario');
const { buildUsuarioFilterFromReq } = require('../lib/utils');

/* GET usuarios page. */
router.get('/', asyncHandler(async function (req, res) {
  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id';
  const includeTotal = true;

  const filters = buildUsuarioFilterFromReq(req);
  const {total, rows} = await Usuario.list(filters, start, limit, sort, includeTotal);

  res.render('usuarios', { total, usuarios: rows });

}));

module.exports = router;
