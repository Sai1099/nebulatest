document.querySelectorAll(".fig").forEach(product=>{
    product.addEventListener("click",()=>{
        // ${window.location.href.replace(/^https?:\/\//, '').split('/')[window.location.href.replace(/^https?:\/\//, '').split('/').length-1]}
        // console.log(product.lastElementChild.innerHTML.replaceAll("(","%28").replaceAll(")","%29"))
        
        if (window.location.href.replace(/^https?:\/\//, '').split('/')[window.location.href.replace(/^https?:\/\//, '').split('/').length-1] != "shop"){
        window.location.assign(`/shop/details/${window.location.href.slice(window.location.href.indexOf('shop?type=')+10)}/${product.lastElementChild.innerHTML}`); //link to view prod
    }else{
        window.location.assign(`/shop/details/tshirts/${product.lastElementChild.innerHTML}`); //link to view prod
    }
    })
})

// //link redirect
// let ordBut= document.getElementById("orderButton")
// ordBut.addEventListener("click",()=>{
//     let ordLink = product.lastElementChild.innerHTML.replace(/ /g,"%20")
//     console.log(ordLink)
//     window.location.assign(`/order/${ordLink}`)
//   })
  
  
//code to open modals
// const openModalButtons = document.querySelectorAll('[data-modal-target]')
// const closeModalButtons = document.querySelectorAll('[data-close-button]')
// const overlay = document.getElementById('overlay')

// openModalButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     const modal = document.querySelector(button.dataset.modalTarget)
//     openModal(modal)
//   })
// })

// overlay.addEventListener('click', () => {
//   const modals = document.querySelectorAll('.modal.active')
//   modals.forEach(modal => {
//     closeModal(modal)
//   })
// })

// closeModalButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     const modal = button.closest('.modal')
//     closeModal(modal)
//   })
// })

// function openModal(modal) {
//   if (modal == null) return
//   modal.classList.add('active')
//   overlay.classList.add('active')
//   document.body.style.overflow = "hidden"
// }

// function closeModal(modal) {
//   if (modal == null) return
//   modal.classList.remove('active')
//   overlay.classList.remove('active')
//   document.body.style.overflow = "scroll"
// }