const socket=io();



const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocation = document.querySelector('#send-location'); 

const $message = document.querySelector('#message');
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML


const { username, room } =Qs.parse(location.search ,{ignoreQueryPrefix:true})

const  autoscroll  =  ()  =>  {
    // New message element
    const  $newMessage  =  $message.lastElementChild
    
    //  Height  of  the  new  message
    const  newMessageStyles  =  getComputedStyle($newMessage)
    const  newMessageMargin  =  parseInt(newMessageStyles.marginBottom) 
    const  newMessageHeight  =  $newMessage.offsetHeight  +  newMessageMargin
    
    //  Visible  height
    const  visibleHeight  =  $message.offsetHeight
    
    //  Height  of  messages  container
    const  containerHeight  =  $message.scrollHeight
    
    //  How  far  have  I  scrolled?
    const  scrollOffset  =  $message.scrollTop  +  visibleHeight
    
    if  (containerHeight  -  newMessageHeight  <=  scrollOffset)  {
    $message.scrollTop  =  $message.scrollHeight
    }
    }

socket.on('message',(message)=>{
    console.log(message);
    if(message==null||message=='')
    {
        return alert('You can not send a empty message ')
    }
    const html =Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend',html);
    autoscroll();
})


socket.on('locationshare',(message)=>{
    const html = Mustache.render(locationMessageTemplate,{
        username:message.username,
       url:message.url,
       createdAt:moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html);
    autoscroll();
})
socket.on('roomData',({users,room})=>{
    const html=Mustache.render(sidebarTemplate,{
        users,
        room
    })
    document.querySelector('#sidebar').innerHTML=html;
})


//input given by  user 
$messageForm.addEventListener('submit',(e)=>{
       e.preventDefault();

       //disable button
  $messageFormButton.setAttribute('disabled','disabled');
const message=e.target.elements.message.value;

//profane filter is used 
socket.emit('sendMessage',message,(error)=>{

    //enable button 
    $messageFormButton.removeAttribute('disabled');
    //clear input value after send
    $messageFormInput.value='';
    $messageFormInput.focus();
    if(error)
    {
        return console.log(error);
    }

    console.log('message delivered !');
});   
})


//loaction is shared 
$sendLocation.addEventListener('click',()=>{

    //disable location sharing  button 
   $sendLocation.setAttribute('disabled','disabled')

    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }
    else
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);

        socket.emit('sendLocation', {
            latitude:position.coords.latitude,
            longtitude:position.coords.longitude
        },()=>{
            console.log('Location Shared !')
            //enable location sharing button
            $sendLocation.removeAttribute('disabled')
        })
    })
})

socket.emit('join',{ username, room },(error)=>{
    if(error){
        alert(error);
        location.href='/'
    }
});

// socket.on('countUpdated',(count)=>{
// console.log('The count has been updated  '+count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
// console.log('clicked')
// socket.emit('increment')
// })