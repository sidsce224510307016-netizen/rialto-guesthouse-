function animateRooms() {
  gsap.from(".room", {
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.6,
    ease: "power2.out"
  });
}

function animateModalOpen() {
  gsap.from(".modal-content", {
    scale: 0.5,
    opacity: 0,
    duration: 0.4,
    ease: "back.out(1.7)"
  });
}