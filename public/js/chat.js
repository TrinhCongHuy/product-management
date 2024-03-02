import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'



// UPLOAD-IMAGE
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
    multiple: true,
    maxFileCount: 6
});


// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .chat-form")

if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value
        const images = upload.cachedFileArray || []

        if(content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            })
            e.target.elements.content.value = ""
            upload.resetPreviewPanel(); // clear all selected images

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
    
    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = ""

    if(myId == data.userId) {
        div.classList.add("chat-outgoing")
    }else {
        div.classList.add("chat-incoming")
        htmlFullName = `<div class="chat-name"> ${data.fullName} </div> `
    }

    if(data.content) {
        htmlContent = `<div class="chat-content"> ${data.content} </div> `
    }

    if(data.images) {
        htmlImages += `<div class="chat-image">`
        for (const image of data.images) {
            htmlImages += `<img src="${image}">`
        }
        htmlImages += `</div>`
    }

    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;

    body.insertBefore(div, boxTyping)

    body.scrollTop = body.scrollHeight

    // preview image
    const boxImage = div.querySelector(".chat-image");
    if (boxImage) {
        const gallery = new Viewer(boxImage);
    }
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
// VIEWER IMAGE
const chatBody = document.querySelector(".chat .chat-body")
if (chatBody) {
    const gallery = new Viewer(chatBody);
}