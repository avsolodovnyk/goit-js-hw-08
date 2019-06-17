"use strict";
const refs = {
  markupPos: document.querySelector("ul.js-gallery"),
  backdropContent: document.querySelector("div.js-lightbox__content"),
  exitModalButton: document.querySelector("button[data-action=close-lightbox]"),
};
import galleryItems from "./gallery-items.js";
refs.markupPos.insertAdjacentHTML(
  "afterbegin",
  createGalleryMarkup(galleryItems)
);
refs.markupPos.addEventListener("click", handleImageClick);
refs.backdropContent.addEventListener("click", handleBackdropClick);
refs.exitModalButton.addEventListener("click", closeModal);
const images=document.querySelectorAll(".gallery__image");
images.forEach(image=> lazyload(image));
function lazyload(element) {
const option={
    rootMargin: "50px 0px",
    threshold: 0.01
};
function onInteseptionImg(enties,observer){
    enties.forEach(entry=>{
        if(entry.isIntersecting){
            const image=entry.target;
            const imageUrl=image.dataset.lazy;
            image.setAttribute("src",imageUrl);
            observer.disconnect();
        }
})
}
const io=new IntersectionObserver(onInteseptionImg,option);
io.observe(element);
}
function handleImageClick(event) {
  if (
    event.target.parentNode === event.currentTarget ||
    event.target === event.currentTarget
  ) {
    return;
  }
  event.preventDefault();
  const { alt } = event.target;
  const { source: link } = event.target.dataset;
  openModal(link, alt);
}
function handleBackdropClick(event) {
  if (event.target !== event.currentTarget) {
    return;
  }
  closeModal();
}
function openModal(link, alt) {
  const backdrop = document.querySelector("div.lightbox");
  backdrop.classList.add("is-open");
  const img = document.querySelector(
    "div.lightbox__content>Img.lightbox___image"
  );
  img.setAttribute("src", link);
  img.setAttribute("alt", alt);

  window.addEventListener("keydown", handleCloseModalKey);
}
function closeModal(event) {
  const backdrop = document.querySelector("div.lightbox");
  backdrop.classList.remove("is-open");
  const img = document.querySelector(
    "div.lightbox__content>Img.lightbox___image"
  );
  img.setAttribute("src", "");
  img.setAttribute("alt", "");
  window.removeEventListener("keydown", handleCloseModalKey);
}
function handleCloseModalKey() {
  if (event.code !== `Escape`) {
    return;
  }
  closeModal();
}
function createGalleryMarkup(galleryItems) {
  return galleryItems
    .map(
      item => `<li class="gallery__item">
  <a href=${item.original} class="gallery__link">
  <img class="gallery__image" src="#" data-lazy=${item.preview} data-source=${
        item.original
      } alt=${item.description}>
  <span class="gallery__icon">
  <i class="material-icons">zoom_out_map</i>
 </span></a></li>`
    )
    .join("");
}
