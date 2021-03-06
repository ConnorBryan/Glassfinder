import axios from "axios";
import { partial } from "lodash";

import * as config from "../../config";
import { logger } from "../../util";

export default class API {
  /**
   * @method fetchVerbiage
   * @desc Retrieve the text to display inside the application.
   * @returns {object}
   */
  static async fetchVerbiage() {
    try {
      const url = `${config.API_ROOT}/verbiage`;
      const {
        data: {
          payload: { verbiage }
        }
      } = await axios.get(url);

      return verbiage;
    } catch (e) {
      console.error(e);

      return {};
    }
  }

  /**
   * @method fetchAboutItems
   * @desc Retrieve items for the About page.
   * @returns {Array<object>}
   */
  static async fetchAboutItems() {
    try {
      const url = `${config.API_ROOT}/about`;
      const {
        data: {
          payload: { about }
        }
      } = await axios.get(url);

      return about;
    } catch (e) {
      console.error(e);

      return [];
    }
  }

  /**
   * @method fetchHelpItems
   * @desc Retrieve items for the Help page.
   * @returns {Array<object>}
   */
  static async fetchHelpItems() {
    try {
      const url = `${config.API_ROOT}/help`;
      const {
        data: {
          payload: { help }
        }
      } = await axios.get(url);

      return help;
    } catch (e) {
      console.error(e);

      return [];
    }
  }

  /**
   * @method fetchUpdateItems
   * @desc Retrieve items for the Updates page.
   * @returns {Array<object>}
   */
  static async fetchUpdateItems() {
    try {
      const url = `${config.API_ROOT}/updates`;
      const {
        data: {
          payload: { update }
        }
      } = await axios.get(url);

      return update;
    } catch (e) {
      console.error(e);

      return [];
    }
  }

  /**
   * @method fetchModel
   * @desc Retrieve a single instance of a model from the database.
   * @param {string} singular
   * @param {string} plural
   * @param {number} id
   */
  static async fetchModel(singular, plural, id) {
    try {
      const url = `${config.API_ROOT}/${plural}/${id}`;
      const {
        data: {
          payload: { [singular]: model }
        }
      } = await axios.get(url);

      return model;
    } catch (e) {
      logger(e);

      throw e;
    }
  }

  static fetchShop = partial(API.fetchModel, "shop", "shops");
  static fetchArtist = partial(API.fetchModel, "artist", "artists");
  static fetchBrand = partial(API.fetchModel, "brand", "brands");
  static fetchPiece = partial(API.fetchModel, "piece", "pieces");

  /**
   * @async
   * @method fetchModels
   * @desc Retrieve a collection of models from the database.
   * @param {string} plural
   * @param {number} page
   * @returns {object}
   */
  static async fetchModels(
    plural,
    page = 0,
    sort = config.SORT_DATE_ASCENDING,
    type
  ) {
    try {
      const url = `${config.API_ROOT}/${plural}?page=${page}&sort=${sort}`;
      const {
        data: { payload }
      } = await axios.get(url);

      return { ...payload };
    } catch (e) {
      logger(e);

      return {
        page: [],
        totalPages: 1,
        perPage: 0
      };
    }
  }

  static fetchShops = partial(API.fetchModels, "shops");
  static fetchArtists = partial(API.fetchModels, "artists");
  static fetchBrands = partial(API.fetchModels, "brands");
  static fetchPieces = partial(API.fetchModels, "pieces");

  static async fetchPiecesForId(
    id,
    page = 0,
    sort = config.SORT_DATE_ASCENDING
  ) {
    try {
      const url = `${
        config.API_ROOT
      }/users/${id}/pieces?page=${page}&sort=${sort}`;
      const {
        data: { payload }
      } = await axios.get(url);

      return { ...payload };
    } catch (e) {
      console.error(e);

      return {
        page: [],
        totalPages: 1,
        perPage: 0
      };
    }
  }

  static async fetchModelPieces(
    resource,
    page = 0,
    sort = config.SORT_DATE_ASCENDING,
    id
  ) {
    try {
      const url = `${
        config.API_ROOT
      }/${resource}/${id}/pieces?page=${page}&sort=${sort}`;
      const {
        data: { payload }
      } = await axios.get(url);

      return { ...payload };
    } catch (e) {
      console.error(e);

      return {
        page: [],
        totalPages: 1,
        perPage: 0
      };
    }
  }

  static fetchShopPieces = partial(API.fetchModelPieces, "shops");
  static fetchArtistPieces = partial(API.fetchModelPieces, "artists");

  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns {object}
   */
  static async signin(email, password) {
    try {
      const url = `${config.API_ROOT}/sign-in`;
      const {
        data: {
          payload: { token, data: account }
        }
      } = await axios.post(url, {
        email,
        password
      });

      return { token, account };
    } catch (e) {
      const errorAccount = {
        token: null,
        account: null
      };
      const errorMessage = e.response.data.error;

      if (
        errorMessage ===
        `Error: ${config.UNVERIFIED_USER_SIGN_IN_ATTEMPT_ERROR}`
      ) {
        errorAccount.unverified = true;
      }

      return errorAccount;
    }
  }

  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns {number}
   */
  static async signup(email, password) {
    try {
      const url = `${config.API_ROOT}/signup`;
      const {
        data: {
          payload: { id }
        }
      } = await axios.post(url, {
        email,
        password
      });

      return id;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   *
   * @param {string} id
   * @param {string} verificationCode
   */
  static async verify(id, verificationCode) {
    try {
      const url = `${config.API_ROOT}/users/${id}/verify`;

      await axios.post(url, { verificationCode });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   *
   * @param {string} email
   */
  static async resendVerification(email) {
    try {
      const url = `${config.API_ROOT}/resend-verification`;

      await axios.post(url, { email });

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  /**
   *
   * @param {string} name
   * @param {string} email
   * @param {string} message
   */
  static async sendContactMessage(name, email, message) {
    try {
      const url = `${config.API_ROOT}/contact`;

      await axios.post(url, {
        name,
        email,
        message
      });

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  /**
   *
   * @param {string} id
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  static async updatePassword(id, currentPassword, newPassword) {
    try {
      const url = `${config.API_ROOT}/users/${id}/update-password`;

      await axios.post(url, {
        currentPassword,
        newPassword
      });

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  /**
   *
   * @param {string} id
   * @param {string} currentPassword
   * @param {object} configuration
   * @returns {object}
   */
  static async becomeA(id, type, configuration) {
    try {
      const url = `${config.API_ROOT}/users/${id}/link`;
      const {
        data: {
          payload: { data: account }
        }
      } = await axios.post(url, {
        type,
        config: JSON.stringify(configuration)
      });

      return account;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  static becomeAShop = (id, configuration) =>
    API.becomeA(id, config.LINK_TYPES.SHOP, configuration);
  static becomeAnArtist = (id, configuration) =>
    API.becomeA(id, config.LINK_TYPES.ARTIST, configuration);
  static becomeABrand = (id, configuration) =>
    API.becomeA(id, config.LINK_TYPES.BRAND, configuration);

  /**
   * @param {string} id
   * @param {object} values
   * @returns {object}
   */
  static async updateInformation(id, values) {
    try {
      const url = `${config.API_ROOT}/users/${id}`;
      const {
        data: {
          payload: { link }
        }
      } = await axios.post(url, {
        values: JSON.stringify(values)
      });

      return link;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  /**
   * @param {string} id
   * @param {string} image
   * @returns {object}
   */
  static async uploadImage(id, image) {
    try {
      const formData = new FormData();

      formData.append("image", image);

      const url = `${config.API_ROOT}/users/${id}/upload-image`;
      const {
        data: {
          payload: { link }
        }
      } = await axios.post(url, formData);

      return link;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  /**
   * @param {string} id
   * @param {string} name
   * @param {string} maker
   * @param {string} price
   * @param {string} description
   * @param {string} location
   */
  static async uploadPiece({
    id,
    name,
    maker,
    price,
    description,
    location,
    artistId,
    artistEntry,
    brandId,
    brandEntry,
    image
  }) {
    try {
      const url = `${config.API_ROOT}/pieces?userId=${id}`;
      const {
        data: {
          payload: { piece }
        }
      } = await axios.post(url, {
        name,
        maker,
        price,
        description,
        location,
        artistId: artistId ? parseInt(artistId, 10) : null,
        artistEntry,
        brandId: brandId ? parseInt(brandId, 10) : null,
        brandEntry,
        image
      });

      return piece;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  /**
   * @param {string} pieceId
   * @returns {boolean}
   */
  static async removePiece(pieceId) {
    try {
      const url = `${config.API_ROOT}/pieces/${pieceId}`;

      await axios.delete(url);

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  /**
   * @param {string} id
   * @param {string} image
   * @returns {object}
   */
  static async uploadPieceImage(id, image) {
    try {
      const formData = new FormData();

      formData.append("image", image);

      const url = `${config.API_ROOT}/pieces/${id}/upload-image`;
      const {
        data: {
          payload: { piece }
        }
      } = await axios.post(url, formData);

      return piece;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  /**
   * @param {string} id
   * @param {string} name
   * @param {string} maker
   * @param {string} price
   * @param {string} description
   * @param {string} location
   */
  static async updatePieceInformation(id, values) {
    try {
      const url = `${config.API_ROOT}/pieces/${id}`;
      const {
        data: {
          payload: { piece }
        }
      } = await axios.post(url, {
        values: JSON.stringify(values)
      });

      return piece;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  /**
   * @returns {Array<object>}
   */
  static async fetchMapMarkers() {
    try {
      const url = `${config.API_ROOT}/mapmarkers`;
      const {
        data: {
          payload: { markers }
        }
      } = await axios.get(url);

      return markers;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /**
   * @param {string} address
   * @returns {?object}
   */
  static async transformAddressToCoordinates(address) {
    try {
      const url = `${config.GOOGLE_MAPS_GEOCODE_URL}${address}`;
      const {
        data: { status, results }
      } = await axios.get(url);

      if (status === "OK" && results[0]) {
        const {
          geometry: {
            location: { lat, lng }
          }
        } = results[0];

        return { lat, lng };
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  static async genericImageUpload(image) {
    try {
      const formData = new FormData();

      formData.append("image", image);

      const url = `${config.API_ROOT}/images`;
      const {
        data: {
          payload: { imagePath }
        }
      } = await axios.post(url, formData);

      return imagePath;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  static async retrieveAllArtists() {
    try {
      const url = `${config.API_ROOT}/artists?all=true`;
      const {
        data: {
          payload: { collection }
        }
      } = await axios.get(url);

      return collection;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async retrieveAllBrands() {
    try {
      const url = `${config.API_ROOT}/brands?all=true`;
      const {
        data: {
          payload: { collection }
        }
      } = await axios.get(url);

      return collection;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getCreditedPieces(id) {
    try {
      const url = `${config.API_ROOT}/artists/${id}/all_pieces`;
      const {
        data: {
          payload: { fromArtist }
        }
      } = await axios.get(url);

      return fromArtist;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async getAllShopToBrands() {
    try {
      const url = `${config.API_ROOT}/shop-to-brands`;
      const {
        data: {
          payload: { shopToBrands }
        }
      } = await axios.get(url);

      return shopToBrands;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  static async getShopToBrandAssociations(shopId) {
    try {
      const url = `${config.API_ROOT}/shops/${shopId}/brands`;
      const {
        data: {
          payload: { brands }
        }
      } = await axios.get(url);

      return brands;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async associateShopWithBrand(shopId, brandId) {
    try {
      const url = `${config.API_ROOT}/shops/${shopId}/brands/${brandId}`;
      const {
        data: {
          payload: { association }
        }
      } = await axios.post(url);

      return association;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async disassociateShopWithBrand(shopId, brandId) {
    try {
      const url = `${config.API_ROOT}/shops/${shopId}/brands/${brandId}`;

      await axios.delete(url);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async getBrand(id) {
    try {
      const url = `${config.API_ROOT}/brands/${id}`;
      const {
        data: {
          payload: { brand }
        }
      } = await axios.get(url);

      return brand;
    } catch (e) {
      console.error(e);
      return;
    }
  }
}
