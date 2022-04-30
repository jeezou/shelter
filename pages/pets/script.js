"use strict";

let pets = null;
let cards = null;
const NUM = getCardsNum();
const PNUM = 48 / NUM;

fetch("../../assets/json/pets.json")
  .then((response) => {
    return response.json();
  })
  .then((jsondata) => {
    pets = jsondata;
    cards = cardsInit();

    sliderInit();
    paginationChecker();
    initPopupCards();
  });

window.addEventListener("load", function () {
  //burger menu
  const burger = this.document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  const links = document.querySelectorAll(".nav>a");

  const popup = document.querySelector(".popup");

  const cards = document.querySelectorAll(".pets__container .card");

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
      e.target !== burger
    ) {
      console.log("close");
      console.log(e.target);
      enableScroll();
      toggleMenu();
    }

    //pagination

    if (popup.classList.contains("popup-active")) {
      console.log(e.target);
      let boolean = false;

      console.log(boolean);

      const popup_container = popup.querySelector(".popup__container");
      if (popup_container !== e.target && !popup_container.contains(e.target))
        boolean = true;

      const cards = document.querySelectorAll(".pets__container .card");
      cards.forEach((card) => {
        if (card.contains(e.target) || card === e.target) boolean = false;
      });

      console.log(boolean);

      if (boolean) closePopup(popup);
    }
  });

  burger.addEventListener("click", () => {
    console.log("burger click");
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
});

function initPopupCards() {
  const cards = document.querySelectorAll(".pets__container .card");
  console.log(cards);
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (card.contains(e.target)) {
        openPopup(card);
      }
    });
  });
}

function closePopup(popup) {
  popup.classList.remove("popup-active");
  document.querySelector("body").classList.remove("popup-active");
  document.querySelector(".main-header").classList.remove("main-header-active");

  enableScroll();
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
  document.querySelector(".main-header").classList.add("main-header-active");
  disableScroll();
  popup.querySelector(".popup__button").classList.remove("hover");
}

function toggleMenu() {
  document.querySelector(".nav").classList.toggle("nav-active");
  document.querySelector(".main-header .logo").classList.toggle("logo-active");
  document.querySelector(".burger").classList.toggle("burger-active");
  document.querySelector("body").classList.toggle("body-active");
  document.querySelector(".main-header").classList.toggle("main-header-active");
}

function normalizeNum() {
  const lleft = document.querySelector(".pag__end-left");
  const left = document.querySelector(".pag__btn-left");
  const right = document.querySelector(".pag__btn-right");
  const rright = document.querySelector(".pag__end-right");
  const num = document.querySelector(".pag__number");

  const slider = document.querySelector(".slider");
  const CURR = slider.dataset.current;

  if (CURR == 1) {
    lleft.classList.add("pag__end-btn--inactive");
    left.classList.add("pag__btn--inactive");

    rright.classList.remove("pag__end-btn--inactive");
    right.classList.remove("pag__btn--inactive");
  } else if (CURR == PNUM) {
    rright.classList.add("pag__end-btn--inactive");
    right.classList.add("pag__btn--inactive");

    lleft.classList.remove("pag__end-btn--inactive");
    left.classList.remove("pag__btn--inactive");
  } else {
    rright.classList.remove("pag__end-btn--inactive");
    right.classList.remove("pag__btn--inactive");

    lleft.classList.remove("pag__end-btn--inactive");
    left.classList.remove("pag__btn--inactive");
  }
  num.textContent = CURR;
}

function paginationChecker() {
  const lleft = document.querySelector(".pag__end-left");
  const left = document.querySelector(".pag__btn-left");
  const right = document.querySelector(".pag__btn-right");
  const rright = document.querySelector(".pag__end-right");

  const slider = document.querySelector(".slider");

  right.addEventListener("click", function () {
    if (slider.dataset.current < PNUM) {
      slider.dataset.current = parseInt(slider.dataset.current) + 1;
      slider.style.cssText += `left: -${(slider.dataset.current - 1) * 100}%;`;
      normalizeNum();
    }
  });

  rright.addEventListener("click", function () {
    if (slider.dataset.current < PNUM) {
      slider.dataset.current = PNUM;
      slider.style.cssText += `left:-${(PNUM - 1) * 100}%;`;
      normalizeNum();
    }
  });

  left.addEventListener("click", function () {
    if (slider.dataset.current > 1) {
      slider.dataset.current = parseInt(slider.dataset.current) - 1;
      slider.style.cssText += `left: -${(slider.dataset.current - 1) * 100}%;`;
      normalizeNum();
    }
  });

  lleft.addEventListener("click", function () {
    if (slider.dataset.current > 1) {
      slider.dataset.current = 1;
      slider.style.cssText += `left: 0;`;
      normalizeNum();
    }
  });
}

function sliderInit() {
  const slider = document.querySelector(".slider");
  slider.dataset.current = 1;
  for (let i = 0; i < PNUM; i++) {
    let cont = document.createElement("div");
    cont.classList.add("pets__container");
    for (let j = 0; j < NUM; j++)
      cont.appendChild(getCompleteCard(cards[i][j], pets));
    slider.appendChild(cont);
  }
  const containers = slider.querySelectorAll(".pets__container");
  slider.style.cssText = `width: ${PNUM * 100}%;`;
  containers.forEach((container) => {
    container.style.cssText = `width: ${100 / PNUM}%;`;
  });
}

function cardsInit() {
  let cards = [];
  let checker = [0, 0, 0, 0, 0, 0, 0, 0];

  for (let i = 0; i < PNUM; i++) {
    let tmp = [];
    for (let j = 0; j < NUM; j++) {
      let reroll = true;
      while (reroll) {
        let rand = Math.floor(Math.random() * 8);
        if (!tmp.includes(rand) && checker[rand] != 1) {
          checker[rand]++;
          reroll = false;
          tmp.push(rand);

          if (Math.min(...checker) == 1) checker = [0, 0, 0, 0, 0, 0, 0, 0];
        }
      }
    }
    cards.push(tmp);
  }

  console.log(cards);

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
  let num = 8;
  if (window.matchMedia("(max-width: 1279px)").matches) num = 6;
  if (window.matchMedia("(max-width: 767px)").matches) num = 3;
  return num;
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
