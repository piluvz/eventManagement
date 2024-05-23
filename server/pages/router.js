const express = require('express')
const router = express.Router(); 
const Categories = require('../Categories/Categories')
const User = require('../auth/User')
const Event = require('../events/Event')

router.get('/', async(req, res) => {
    const options = {}
    const categories = await Categories.findOne({key: req.query.categ})
    if(categories){
        options.category = categories._id
    }

    if(req.query.search && req.query.search.length > 0){
        options.$or = [
            {
                title: new RegExp(req.query.search , 'i')
            }
        ]
        res.locals.search = req.query.search
    }

    const allCategories = await Categories.find()
    const events = await Event.find(options).populate('category').sort({ date: 1 });

    const user = req.user ? await User.findById(req.user._id) : {}

    res.render("index", {events, categories: allCategories, user})
})

router.get('/login', (req, res) => {
    res.render("login", { user: req.user ? req.user: {}})
})

router.get('/register', (req, res) => {
    res.render("register", { user: req.user ? req.user: {}})
})

router.get('/profile/:id', async(req, res) => {

    const user = await User.findById(req.params.id).populate('myEvents')
    .populate({path: 'myEvents', populate: {path: 'category'}})

    const allCategories = await Categories.find()
    
    if (user) {
        user.myEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        res.render("profile", {categories: allCategories, user: user, loginUser: req.user});
    } else {
        res.redirect('/not-found');
    }
})

router.get('/admin/:id', async(req, res) => {
    const allCategories = await Categories.find()
    const user = await User.findById(req.params.id);
    const events = await Event.find().populate('category').sort({ date: 1 });
    res.render("adminProfile", {events, categories: allCategories, user: user, loginUser: req.user ? req.user: {}})
})

router.get('/new', async(req, res) => {
    const allCategories = await Categories.find()
    res.render("new", {categories: allCategories, user: req.user ? req.user: {}})
})

router.get('/edit/:id', async(req, res) => {
    const allCategories = await Categories.find()
    const event = await Event.findById(req.params.id)
    res.render("edit", {event, categories: allCategories, user: req.user ? req.user: {}})
})

router.get('/detail/:id', async(req, res) => {
    const event = await Event.findById(req.params.id).populate('category')
    const user = req.user ? await User.findById(req.user._id) : {}
    res.render('detail', {event, user})
})

router.get('/not-found', (req, res) => {
    res.render('notFound')
})


module.exports = router