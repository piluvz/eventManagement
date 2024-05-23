const express = require('express')
const router = express.Router()
const {registerToEvent} = require('./controller')

router.post('/api/events/registerToEvent', registerToEvent)

module.exports = router