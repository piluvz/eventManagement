const express = require('express')
const passport = require('passport')

const router = express.Router();
const {signup, signin, signout} = require('./controller')
const createAdmin = require('../Admin/seed')

router.post('/api/signup', signup)
router.post('/api/signin', passport.authenticate('local', {failureRedirect : '/login?error=1'}), signin)
router.get('/api/signout', signout)

createAdmin()

module.exports = router