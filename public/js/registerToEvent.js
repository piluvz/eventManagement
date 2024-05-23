function registerToEvent(event, id){
    event.preventDefault();
    axios.post('/api/events/registerToEvent', {id}).then(data => {
        if(data.status == 200){
            alert(data.data)
            location.reload()
        }
    })
}

function cancelRegistration(event, id){
    event.preventDefault();
    axios.delete(`/api/events/registerToEvent/${id}`).then(data => {
        if(data.status == 200){
            alert(data.data)
            location.reload()
        }
    })
}