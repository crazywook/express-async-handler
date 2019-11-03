const express = require('express')
const {router} = require('./route/router')

const app = express();

const port = 3000
const path = 'localhost'

app.use('/api', router)

app.listen(
  port
  ,path
  ,() => {
    console.log('connected')
  }
)
