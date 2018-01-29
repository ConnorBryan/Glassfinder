import axios from "axios";
import { partial } from "lodash";

import API from "../../main/services";
import { ADMIN_API_ROOT } from "../config";

export default class AdminAPI extends API {
  static async fetchAllModels(plural) {
    try {
      const url = `${ADMIN_API_ROOT}/${plural}`;
      const { data: { payload: { collection } } } = await axios.get(url);

      return collection;
    } catch (e) {
      console.error(e);

      return [];
    }
  }

  static fetchAllShops = partial(AdminAPI.fetchAllModels, "shops");
  static fetchAllArtists = partial(AdminAPI.fetchAllModels, "artists");
  static fetchAllBrands = partial(AdminAPI.fetchAllModels, "brands");
  static fetchAllPieces = partial(AdminAPI.fetchAllModels, "pieces");

  static async deleteModel(plural, id) {
    try {
      const url = `${ADMIN_API_ROOT}/${plural}/${id}`;

      await axios.delete(url);

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  static deleteShop = partial(AdminAPI.deleteModel, "shops");
  static deleteArtist = partial(AdminAPI.deleteModel, "artists");
  static deleteBrand = partial(AdminAPI.deleteModel, "brands");
  static deletePiece = partial(AdminAPI.deleteModel, "pieces");
  static deleteUpdate = partial(AdminAPI.deleteModel, "updates");

  static async fetchLinkRequests() {
    try {
      const url = `${ADMIN_API_ROOT}/link-requests`;
      const { data: { payload: { linkRequests } } } = await axios.get(url);

      return linkRequests;
    } catch (e) {
      console.error(e);

      return [];
    }
  }

  static async approveLink(id) {
    try {
      const url = `${ADMIN_API_ROOT}/link-requests/${id}/approve`;

      await axios.post(url);

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  static async denyLink(id) {
    try {
      const url = `${ADMIN_API_ROOT}/link-requests/${id}/deny`;

      await axios.post(url);

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  static async createUpdate(values) {
    try {
      const url = `${ADMIN_API_ROOT}/updates`;

      await axios.post(url, {
        config: JSON.stringify(values)
      });

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  static async updateUpdate(id, values) {
    try {
      const url = `${ADMIN_API_ROOT}/updates/${id}`;

      await axios.post(url, {
        config: JSON.stringify(values)
      });

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  static async fetchUpdate(id) {
    try {
      const url = `${ADMIN_API_ROOT}/updates/${id}`;
      const { data: { payload: { update } } } = await axios.get(url);

      return update;
    } catch (e) {
      console.error(e);

      return null;
    }
  }
}