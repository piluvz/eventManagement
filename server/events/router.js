const express = require('express');
const router = express.Router();
const {upload} = require('./multer')
const {createEvent, editEvent, deleteEvent, registerToEvent, cancelRegistration} = require('./controller')
const {isAuth} = require('../auth/middlewares')

router.post('/api/events/new', isAuth, upload.single('image'), createEvent)

router.post('/api/events/edit', isAuth, upload.single('image'), editEvent)

router.delete('/api/events/:id', isAuth, deleteEvent)

router.post('/api/events/registerToEvent', isAuth, registerToEvent)

router.delete('/api/events/registerToEvent/:id', isAuth, cancelRegistration)


module.exports = router

