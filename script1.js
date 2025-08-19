// Hiệu ứng nhỏ khi click vào card
document.querySelectorAll(".story-card").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.add("clicked");
    setTimeout(() => card.classList.remove("clicked"), 300);
  });
});

document.querySelector(".btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".story-grid").scrollIntoView({
    behavior: "smooth"
  });
});
