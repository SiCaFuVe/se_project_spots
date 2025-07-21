import "../pages/index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1eabdba8-c02d-4ba2-a779-4636a4dadf09",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([initialCards, userInfo]) => {
    initialCards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
    // console.log(userInfo);
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarImage.src = userInfo.avatar;
  })
  .catch(console.error);

//Original modal
const modals = document.querySelectorAll(".modal");

//profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalBtn = document.querySelector(".profile__add-button");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarImage = document.querySelector(".profile__avatar");
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

// to- do - if the card is liked, set the active class on the card

// Avatar form Elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");
const deleteSubmitButton = document.querySelector(".modal__submit-btn_delete");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.querySelector("#delete-form");

// Preview image pop ups
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn-preview"
);

let selectedCard, selectedCardId;

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

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardDeleteBtn.addEventListener("click", (evt) => {
    console.log(data);
    handleDeleteCard(cardElement, data._id);
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

function handleLike(evt, id) {
  const likeBtn = evt.target;
  const isLiked = likeBtn.classList.contains("card__like-button-liked");
  api
    .changeLikeStatus(id, !isLiked)
    .then((updatedCardData) => {
      if (!isLiked) {
        likeBtn.classList.add("card__like-button-liked");
      } else {
        likeBtn.classList.remove("card__like-button-liked");
      }
    })
    .catch((err) => {
      console.error("Failed to toggle like:", err);
    });
}

// esc key
function keyHandler(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    closeModal(activeModal);
  }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Loading...");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      console.log(data);
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  console.log(cardElement);
  selectedCard = cardElement;
  selectedCardId = cardId;

  openModal(deleteModal);
}
//  const deleteSubmitButton =
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  setButtonText(deleteSubmitButton, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => console.error("Failed to delete card", err))
    .finally(() => {
      setButtonText(deleteSubmitButton, false, "Delete", "Deleting...");
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  setButtonText(cardSubmitButton, true, "Loading...");

  api
    .postCard(inputValues)
    .then((cardData) => {
      const cardEl = getCardElement(cardData);
      cardsList.prepend(cardEl);
      console.log(cardSubmitButton);
      //disableButton(cardSubmitButton, settings);
      closeModal(cardModal);
      evt.target.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setButtonText(cardSubmitButton, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  setButtonText(avatarSubmitButton, true, "Loading...");
  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset(avatarModal);
    })
    .catch((err) => console.error("Failed to update avatar", err))
    .finally(() => {
      setButtonText(avatarSubmitButton, false);
    });
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
  resetValidation(cardForm, [cardNameInput, cardLinkInput], settings);
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  resetValidation(avatarForm, [avatarLinkInput], settings);
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleCardSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
