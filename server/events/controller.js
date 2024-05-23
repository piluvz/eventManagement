const Event = require('./Event')
const User = require('../auth/User')
const fs = require('fs')
const path = require('path')

const createEvent = async(req, res) => {
    if(req.file && req.body.title.length > 2 
        && req.body.date.length > 2
        && req.body.category.length > 2
        && req.body.time.length > 2
        && req.body.place.length > 2
        && req.body.address.length > 2
        && req.body.capacity > 0)
    {
        await new Event({
            title: req.body.title,
            category: req.body.category,
            image: `/img/events/${req.file.filename}`,
            date: req.body.date,
            time: req.body.time,
            place: req.body.place,
            address: req.body.address,
            author: req.user._id,
            capacity: req.body.capacity,
            availableSeats: req.body.capacity,
        }).save()
        res.redirect(`/admin/${req.user._id}`)
    }else{
        res.redirect('/new?error=1')
    }
}

const editEvent = async(req, res) => {
    if(req.file && req.body.title.length > 2 
        && req.body.date.length > 2
        && req.body.category.length > 2
        && req.body.time.length > 2
        && req.body.place.length > 2
        && req.body.address.length > 2
        && req.body.capacity > 0 )
    {
        const event = await Event.findById(req.body.id);

        if (req.file) {
            fs.unlinkSync(path.join(__dirname + '../../../public' + event.image));
        }

        const updatedData = {
            title: req.body.title,
            category: req.body.category,
            date: req.body.date,
            time: req.body.time,
            place: req.body.place,
            address: req.body.address,
            author: req.user._id,
            capacity: req.body.capacity,
        };

        if (req.file) {
            updatedData.image = `/img/events/${req.file.filename}`;
        }

        if (req.body.capacity != event.capacity) {
            updatedData.availableSeats = req.body.capacity - (event.capacity - event.availableSeats);
        }

        await Event.findByIdAndUpdate(req.body.id, updatedData);
        res.redirect('/admin/' + req.user._id);

        // const event = await Event.findById(req.body.id)
        // fs.unlinkSync(path.join(__dirname + '../../../public' + event.image))
        // await Event.findByIdAndUpdate(req.body.id, {
        //     title: req.body.title,
        //     category: req.body.category,
        //     image: `/img/events/${req.file.filename}`,
        //     date: req.body.date,
        //     time: req.body.time,
        //     place: req.body.place,
        //     address: req.body.address,
        //     author: req.user._id,
        //     capacity: req.body.capacity,
        // })

        // res.redirect('/admin/' + req.user._id)
    }else{
        res.redirect(`/edit/${req.body.id}?error=1`)
    }
}

const deleteEvent = async(req, res) => {
    const event = await Event.findById(req.params.id)
    if(event){
        fs.unlinkSync(path.join(__dirname + '../../../public' + event.image))
        await Event.deleteOne({_id : req.params.id})
        res.status(200).send('ok')
    }else{
        res.status(404).send('Not found')
    }
}

const registerToEvent = async(req, res) => {
    if(req.user && req.body.id){
        const user = await User.findById(req.user.id)
        const findEvent = user.myEvents.filter(item => item._id == req.body.id)
        const event = await Event.findById(req.body.id);

        if (findEvent.length == 0) {
            if (event.availableSeats > 0) {
                user.myEvents.push(req.body.id);
                user.save();

                event.availableSeats -= 1;
                event.save();

                res.send('Вы успешно зарегистрировались на событие');
            } else {
                res.send('Нет доступных мест на это событие');
            }
        } else {
            res.send('Вы уже зарегистрированы на событие');
        }
    }
        // if(findEvent.length == 0){
        //     user.myEvents.push(req.body.id)
        //     user.save()
        //     res.send('Вы успешно зарегистрировались на событие')
        // }else{
        //     res.send('Вы уже зарегистрированы на событие')
        // }
    // } 
}

const cancelRegistration = async(req, res) => {
    if(req.user && req.params.id){
        const user = await User.findById(req.user.id)
        const findEvent = user.myEvents.filter(item => item._id == req.params.id) 
        const event = await Event.findById(req.params.id)


        for(let i = 0; i < user.myEvents.length; i++){
            if(user.myEvents[i] == req.params.id){
                user.myEvents.splice(i, 1)
                user.save()

                event.availableSeats += 1;
                event.save();

                res.send('Бронирование успешно удалено')
            }
        }
    }
}

module.exports = {
    createEvent,
    editEvent,
    deleteEvent,
    registerToEvent,
    cancelRegistration
}