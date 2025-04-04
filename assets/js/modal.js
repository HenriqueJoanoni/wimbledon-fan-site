/**
 * Base code from: https://www.freecodecamp.org/news/how-to-build-a-modal-with-javascript/
 */

// modal.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector("modal-component .modal");
    const overlay = document.querySelector(".overlay");
    const closeModalBtn = document.querySelector(".btn-close");

    // Initialize modal state
    if (modal && overlay) {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    }

    // Close modal function
    const closeModal = function () {
        modal?.classList.add("hidden");
        overlay?.classList.add("hidden");
    };

    // Open modal function
    const openModal = function () {
        modal?.classList.remove("hidden");
        overlay?.classList.remove("hidden");
    };

    // Event delegation for cards
    document.addEventListener('click', (e) => {
        const card = e.target.closest('activity-card');
        if (card) {
            openModal();
        }
    });

    // Close handlers
    closeModalBtn?.addEventListener("click", closeModal);
    overlay?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
});

// const modal = document.querySelector(".modal");
// const overlay = document.querySelector(".overlay");
// const closeModalBtn = document.querySelector(".btn-close");
//
// // close modal function
// const closeModal = function () {
//     modal.classList.add("hidden");
//     overlay.classList.add("hidden");
// };
//
// // close the modal when the close button and overlay is clicked
// closeModalBtn.addEventListener("click", closeModal);
// overlay.addEventListener("click", closeModal);
//
// // close modal when the Esc key is pressed
// document.addEventListener("keydown", function (e) {
//     if (e.key === "Escape" && !modal.classList.contains("hidden")) {
//         closeModal();
//     }
// });
//
// // open modal function
// const openModal = function () {
//     modal.classList.remove("hidden");
//     overlay.classList.remove("hidden");
// };
//
// // load modal with data from the html
// document.querySelectorAll('.jh_cardContainer').forEach(card => {
//     card.addEventListener('click', () => {
//         const contentType = card.dataset.modalContent;
//         openModal(contentType);
//     });
// });