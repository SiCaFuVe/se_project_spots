const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  // errorClass: "modal__error_visible", idk where i use this?
};

const showInputError = (formEl, inputElement, errorMsg) => {
  const errorMsgID = inputElement.id + "-error";
  const errorMsgEl = formEl.querySelector("#" + errorMsgID); //(config.inputErrorClass)
  errorMsgEl.textContent = errorMsg;
  inputElement.classList.add("modal__input_type_error"); //(config.inputErrorClass)
};

const hideInputError = (formEl, inputElement) => {
  const errorMsgID = inputElement.id + "-error";
  const errorMsgEl = formEl.querySelector("#" + errorMsgID);
  errorMsgEl.textContent = "";
  inputElement.classList.remove("modal__input_type_error"); //(config.inputErrorClass) should i pass it up in hide error()
};

const checkInputValidity = (formEl, inputElement) => {
  console.log(inputElement.validationMessage);
  if (!inputElement.validity.valid) {
    showInputError(formEl, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formEl, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement);
    // toggleButtonState.classList.add("modal__submit-btn_disabled");
    // add a modifier class to the buttonElement to make it gray (css)
  } else {
    buttonElement.disabled = false;
  }
};

const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
  // toggleButtonState.classList.remove("modal__submit-btn_disabled");
  //remove disabled class
};

const resetValidation = (formEl, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input);
  });
};

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelectorAll(config.submitButtonSelector);

  //handle initial state
  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => {
    setEventListeners(formEl);
  });
};

enableValidation(settings);

//where else shoud i add the config
