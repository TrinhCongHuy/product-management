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
        }
    })
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .chat-body")

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

    body.appendChild(div)

    body.scrollTop = body.scrollHeight
})
// End SERVER_RETURN_MESSAGE

// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .chat-body")
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight
}
// End Scroll chat to bottom

// emoji-picker
const emojiPicker = document.querySelector('emoji-picker')
if (emojiPicker) {
    const input = document.querySelector(".chat .chat-foot input[name='content']")
    emojiPicker.addEventListener('emoji-click', (e) => {
        const icon = e.detail.unicode
            input.value = input.value + icon
    })
}

const btnIcon = document.querySelector('.btn-icon')
if (btnIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(btnIcon, tooltip)

    btnIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}

// End emoji-picker