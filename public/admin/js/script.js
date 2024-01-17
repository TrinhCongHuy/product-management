const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);
    
    buttonsStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status)
            }else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}

// form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword)
        }else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    }) 
}


// pagination

const btnsPagination = document.querySelectorAll("[button-pagination]")
if (btnsPagination.length > 0) {
    let url = new URL(window.location.href)

    btnsPagination.forEach((btn) => {
        btn.addEventListener("click", () => {
            const page = btn.getAttribute("button-pagination")
             if(page) {
                url.searchParams.set("page", page)
             }else {
                url.searchParams.delete("page")
             }
             window.location.href = url.href
        })
    })
}

// checkbox multi

const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
    const checkboxAll = checkboxMulti.querySelector("input[name='checkall']")
    const checkboxIds = checkboxMulti.querySelectorAll("input[name='id']")

    checkboxAll.addEventListener("click", () => {
        if (checkboxAll.checked) {
            checkboxIds.forEach(input => {
                input.checked = true
            })
        }else {
            checkboxIds.forEach(input => {
                input.checked = false
            })
        }
    })

    checkboxIds.forEach(input => {
        input.addEventListener("click", () => {
            const countCheckBox = checkboxMulti.querySelectorAll("input[name='id']:checked").length
            if (countCheckBox == checkboxIds.length) {
                checkboxAll.checked = true
            }else {
                checkboxAll.checked = false
            }
        })
    })
}


// form change multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")

        const typeChange = e.target.elements.type.value
        
        if(typeChange == "del-all") {
            const isConfirm = confirm("Bạn có chắc muốn xoá các sản phẩm này không?")

            if (!isConfirm) {
                return;
            }
        }

        if (inputChecked.length > 0) {
            let ids = []
            inputChecked.forEach(input => {
                const id = input.value
                if(typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    
                    ids.push(`${id}-${position}`)
                }else {
                    ids.push(id)
                }
                
                const inputIds = formChangeMulti.querySelector("input[name='ids']")
                inputIds.value = ids.join(', ')

                formChangeMulti.submit()
            })
        }else {
            alert("Vui lòng chọn ít nhất 1 bảng ghi!")
        }
    })
}

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

// upload image preview
const uploadImage = document.querySelector("[upload-image]")
if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview]")

    uploadImageInput.addEventListener("change" , (e) => {
        const file = e.target.files[0]
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file)
        }
    })
}