document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector("modal-component .modal");
    const overlay = document.querySelector(".overlay");
    const closeModalBtn = document.querySelector(".btn-close");

    if (modal && overlay) {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    }

    const closeModal = function () {
        modal?.classList.add("hidden");
        overlay?.classList.add("hidden");
    };

    const openModal = function (modalType) {
        modal?.classList.remove("hidden");
        overlay?.classList.remove("hidden");
        document.dispatchEvent(new CustomEvent('modalOpened', {
            detail: {modalType: modalType}
        }));
    };

    document.addEventListener('click', (e) => {
        const card = e.target.closest('activity-card');
        if (card) {
            const modalType = card.dataset.modalContent;
            openModal(modalType);
        }
    });

    closeModalBtn?.addEventListener("click", closeModal);
    overlay?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
});
