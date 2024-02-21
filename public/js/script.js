// show alert
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]")

    setTimeout(() => {
        showAlert.classList.add("alert-hide")
    }, time)

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hide")
    })
}