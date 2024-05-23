function deleteEvent(id, authorID){
    axios.delete(`/api/events/${id}`).then( data => {
        if(data.status == 200){
            location.replace(`/admin/${authorID}`)
        }else if(data.status == 404){
            location.replace(`/notFound`)
        }
    })
}