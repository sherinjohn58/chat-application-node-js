const users =[]
const addUser = ({id,username,room})=>{
    username=username.trim().toLowerCase();
    room =room.trim().toLowerCase();


if(!username || !room){
    return{
        error:'UserName and Romm required!'
        
    }
}
 const existinguser = users.find((user)=>{
     return user.room === room && user.username === username
    })
    if(existinguser){
        return{
            error:'UserName is already exist'
        }
    }
const user = {id, username, room }
users.push(user)
return{ user }
    }

    const removeUser =(id)=>{
     const index =users.findIndex((user)=>user.id=id)
        if(index !== -1)
        {
           return users.splice(index,1)[0];
        }
    }

const getUser = (id)=>{
    return users.find((user)=>user.id===id)
}


const getUsersInRoom = (room)=>{
room = room.trim().toLowerCase();
return users.filter((user)=>user.room===room)
}
    // addUser({
    //     id:22,
    //     username:'sherin',
    //     room:'chennai'
    // })
    // addUser({
    //     id:32,
    //     username:'sherin',
    //     room:'Tvl'
    // })
    // addUser({
    //     id:42,
    //     username:'sherin',
    //     room:'Tv'
    // })

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
    //     console.log(users);

//    const user= getUser(42);
//    console.log(user);

// const userList = getUsersInRoom('tv');
// console.log(userList);
// const res = addUser({
//     id:33,
//     username:'sherin',
//     room:'tvl'
// })

// console.log(res);