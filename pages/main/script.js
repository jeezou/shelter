"use strict";

let pets = null;
let cards = null;

fetch("../../assets/json/pets.json")
  .then((response) => {
    return response.json();
  })
  .then((jsondata) => {
    pets = jsondata;
    cards = petsInit(pets);
    reInitPopupCards();
  });

window.addEventListener("load", function () {
  //burger menu
  const burger = this.document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  const links = document.querySelectorAll(".nav>a");

  const popup = document.querySelector(".popup");

  const cards = document.querySelectorAll(".carousel .center-container .card");

  const body = document.querySelector("body");
  const container = popup.querySelector(".popup__container");

  body.addEventListener("mouseover", (e) => {
    if (!container.contains(e.target))
      popup.querySelector(".popup__button").classList.add("hover");
    else popup.querySelector(".popup__button").classList.remove("hover");
  });

  document.addEventListener("mouseleave", (e) => {
    popup.querySelector(".popup__button").classList.remove("hover");
  });

  this.addEventListener("click", function (e) {
    if (
      nav.classList.contains("nav-active") &&
      !nav.contains(e.target) &&
      e.target != burger
    ) {
      enableScroll();
      toggleMenu();
    }

    // console.log(popup.classList.contains("popup-active"));
    if (popup.classList.contains("popup-active")) {
      console.log(e.target);
      let boolean = false;

      console.log(boolean);

      const popup_container = popup.querySelector(".popup__container");
      if (popup_container !== e.target && !popup_container.contains(e.target))
        boolean = true;

      const current_cards = document.querySelectorAll(
        ".carousel .center-container .card"
      );
      current_cards.forEach((card) => {
        if (card.contains(e.target) || card === e.target) boolean = false;
      });

      console.log(boolean);

      if (boolean) closePopup(popup);
    }
  });

  burger.addEventListener("click", () => {
    if (burger.classList.contains("burger-active")) enableScroll();
    else disableScroll();
    toggleMenu();
  });

  links.forEach((el) => {
    el.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 767px)").matches) {
        enableScroll();
        toggleMenu();
      }
    });
  });

  //carousel
  const left_btn = document.querySelector(".arrow-left");
  const right_btn = document.querySelector(".arrow-right");

  right_btn.addEventListener("click", carouselBtnClickHandler);
  left_btn.addEventListener("click", carouselBtnClickHandler);

  //popup
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (card.contains(e.target)) {
        openPopup(card);
      }
    });
  });
});

function closePopup(popup) {
  popup.classList.remove("popup-active");
  document.querySelector("body").classList.remove("popup-active");
  enableScroll();
}

function reInitPopupCards() {
  const cards = document.querySelectorAll(".carousel .center-container .card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (card.contains(e.target)) {
        openPopup(card);
      }
    });
  });
}

function openPopup(card) {
  const popup = document.querySelector(".popup");
  const container = popup.querySelector(".popup__container");
  const index = card.dataset.index;
  container.querySelector(".popup__image").src = pets[index].img;
  container.querySelector(".popup__title").textContent = pets[index].name;
  container.querySelector(".type").textContent = pets[index].type;
  container.querySelector(".breed").textContent = pets[index].breed;
  container.querySelector(".popup__p").textContent = pets[index].description;

  const list = container.querySelector(".popup__list");
  list.querySelector(".age .content").textContent = pets[index].age;
  list.querySelector(".ino .content").textContent = pets[index].inoculations;
  list.querySelector(".dis .content").textContent = pets[index].diseases;
  list.querySelector(".par .content").textContent = pets[index].parasites;

  popup.classList.add("popup-active");
  document.querySelector("body").classList.add("popup-active");
  disableScroll();
  popup.querySelector(".popup__button").classList.remove("hover");
}

function carouselBtnClickHandler(e) {
  e.target.classList.add("arrow-inactive");
  let anim_time = 1;
  const carousel = document.querySelector(".carousel");

  let left_cards = carousel.querySelector(".left-container");
  let right_cards = carousel.querySelector(".right-container");
  let center_cards = carousel.querySelector(".center-container");

  let num = getCardsNum();

  let direction = "";

  if (e.target.classList.contains("arrow-right")) direction = "right";
  else direction = "left";

  carousel.classList.add(`carousel-${direction}`);

  if (direction == "right") cards.center = cards.right;
  else cards.center = cards.left;

  cards.right = getArray(cards.center, num, pets);
  cards.left = getArray(cards.center, num, pets);

  //creating new containers
  const new_right = document.createElement("div");
  const new_left = document.createElement("div");
  for (let i = 0; i < num; i++) {
    new_right.appendChild(getCompleteCard(cards.right[i], pets));
    new_left.appendChild(getCompleteCard(cards.left[i], pets));
  }
  setTimeout(() => {
    if (direction == "right") center_cards.innerHTML = right_cards.innerHTML;
    else center_cards.innerHTML = left_cards.innerHTML;

    right_cards.innerHTML = new_right.innerHTML;
    left_cards.innerHTML = new_left.innerHTML;
    carousel.classList.remove(`carousel-${direction}`);
    e.target.classList.remove("arrow-inactive");
    reInitPopupCards();
  }, anim_time * 1000);
}

function toggleMenu() {
  document.querySelector(".nav").classList.toggle("nav-active");
  document.querySelector(".main-header .logo").classList.toggle("logo-active");
  document.querySelector(".burger").classList.toggle("burger-active");
  document.querySelector("body").classList.toggle("body-active");
}

function petsInit(pets) {
  let num = getCardsNum();
  let cards = { left: [], center: [], right: [] };

  let center = [],
    left = [],
    right = [];

  center = getArray(center, num, pets);
  left = getArray(center, num, pets);
  right = getArray(center, num, pets);

  cards = { left, center, right };

  Object.keys(cards).forEach((key) => {
    let container = document.querySelector(`.cards .${key}-container`);
    cards[key].forEach((index) => {
      container.appendChild(getCompleteCard(index, pets));
    });
  });

  return cards;
}

function getCompleteCard(index, pets) {
  let card = document.createElement("div");
  card.classList.add("card");
  card.dataset.index = index;

  let image = document.createElement("img");
  image.src = pets[index].img;
  image.classList.add("card__image");

  let title = document.createElement("div");
  title.textContent = pets[index].name;
  title.classList.add("card__title");

  let button = document.createElement("button");
  button.textContent = "Learn More";
  button.classList.add("card__button");

  card.appendChild(image);
  card.appendChild(title);
  card.appendChild(button);

  return card;
}

function getCardsNum() {
  let num = 3;
  if (window.matchMedia("(max-width: 1279px)").matches) num = 2;
  if (window.matchMedia("(max-width: 767px)").matches) num = 1;
  return num;
}

function getArray(fcomp, num, pets) {
  let tmp = [];
  for (let i = 0; i < num; i++) {
    let reroll = true;
    while (reroll) {
      let random = Math.floor(Math.random() * pets.length);
      if (!fcomp.includes(random) && !tmp.includes(random)) {
        tmp.push(random);
        reroll = false;
      }
    }
  }
  return tmp;
}

let keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}

let wheelOpt = supportsPassive ? { passive: false } : false;
let wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

// call this to Disable
function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}
