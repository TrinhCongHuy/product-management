import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .chat-form")

if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value

        if(content) {
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = ""
            socket.emit("CLIENT_SEND_TYPING", "hidden")
        }
    })
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .chat-body")
    const boxTyping = document.querySelector(".chat .chat-list-typing")

    const div = document.createElement("div")
    
    let htmlFullName = ""

    if(myId == data.userId) {
        div.classList.add("chat-outgoing")
    }else {
        div.classList.add("chat-incoming")
        htmlFullName = `<div class="chat-name"> ${data.fullName} </div> `
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="chat-content"> ${data.content} </div> 
    `;

    body.insertBefore(div, boxTyping)

    body.scrollTop = body.scrollHeight
})
// End SERVER_RETURN_MESSAGE

// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .chat-body")
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight
}
// End Scroll chat to bottom


// show typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show")

    clearTimeout(timeOut)

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    },3000)
}
// emoji-picker
const btnIcon = document.querySelector('.btn-icon')
if (btnIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(btnIcon, tooltip)

    btnIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}



const emojiPicker = document.querySelector('emoji-picker')
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .chat-foot input[name='content']")
    emojiPicker.addEventListener('emoji-click', (e) => {
        const icon = e.detail.unicode
        inputChat.value = inputChat.value + icon

        const end = inputChat.value.length
        inputChat.setSelectionRange(end, end)
        inputChat.focus()
        
        showTyping()
    })


    inputChat.addEventListener("keyup", () => {

        showTyping()
        
    })
}

// End emoji-picker

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .chat-list-typing")
if(elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if(data.type == "show") {
            const exitTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
    
            if (!exitTyping) {
                const boxTyping = document.createElement("div")
                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user-id", data.userId)

                boxTyping.innerHTML = `
                    <div class="chat-name">${data.fullName}</div>
                    <div class="chat-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>  
                `
                elementListTyping.appendChild(boxTyping)
                bodyChat.scrollTop = bodyChat.scrollHeight
            }
        }else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove)
            }
        }

        
    })
}


// End SERVER_RETURN_TYPING