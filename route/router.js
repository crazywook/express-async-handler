const asyncApp = require('../middleware/asyncApp')
const express = require('express');

const router = asyncApp(express.Router());

const version = '0.0.1'

async function err() {
  throw new Error('test throw')
}

router.route('/version')
  .get(async (req, res) => {
    await err()
    return version;
  })

exports.router = router;
