import "../pages/index.css";
import { enableValidation, settings } from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1eabdba8-c02d-4ba2-a779-4636a4dadf09",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([initialCards, UserInfo]) => {
    initialCards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.apend(cardEl);
    });
    // Handle user information
    // set the src of the avatar image
    // set textContent of both text elements
  })
  .catch(console.error(err));

//Original modal
const modals = document.querySelectorAll(".modal");

//profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalBtn = document.querySelector(".profile__add-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// form elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//card
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardForm = cardModal.querySelector(".modal__form");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn-preview"
);

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".cards")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__trash-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = cardImageEl.src;
    previewModalCaptionEl.textContent = cardNameEl.textContent;
    previewModalImageEl.alt = cardNameEl.textContent;
  });

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button-liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

//Functions
function openModal(modals) {
  modals.classList.add("modal_opened");
  document.addEventListener("keyup", keyHandler);
}
function closeModal(modals) {
  modals.classList.remove("modal_opened");
  document.removeEventListener("keyup", keyHandler);
}

modals.forEach((modals) => {
  modals.addEventListener("click", (event) => {
    if (
      event.target === modals ||
      event.target.classList.contains("modal__close-btn")
    ) {
      closeModal(modals);
    }
  });
});

// esc key
function keyHandler(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    closeModal(activeModal);
  }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: "editModalNameInput.value",
      about: "editModalDescriptionInput.value",
    })
    .then((data) => {
      // To-Do use data argument instead of input values
      profileName.textContent = editModalNameInput.value;
      profileDescription.textContent = editModalDescriptionInput.value;
      closeModal(editModal);
    })
    .catch(console.error);
}

function handleCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardEl = getCardElement(inputValues);
  cardsList.prepend(cardEl);
  console.log(cardSubmitButton);
  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);
  cardNameInput.value = "";
  cardLinkInput.value = "";
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleCardSubmit);

enableValidation(settings);
