

const btnChangeStatus = document.querySelectorAll("[button-change-status]")
if (btnChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("data-path")
    btnChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")

            let statusChange = statusCurrent == "active" ? "inactive" : "active"

            const action = path + `/${statusChange}/${id}?_method=PATCH`
            formChangeStatus.action = action

            formChangeStatus.submit();
        })
    })
}

// delete item
const btnsDelete = document.querySelectorAll("[button-delete]")
if(btnsDelete) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path")
    
    btnsDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xoá!")
            if(isConfirm) {
                const id = btn.getAttribute("data-id")
                const action = `${path}/${id}?_method=DELETE`
                formDeleteItem.action = action
                formDeleteItem.submit()
            }
        })
    })
}