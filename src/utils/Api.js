class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "73c14870-3747-400d-aa7e-47b650676870",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
