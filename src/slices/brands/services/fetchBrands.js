import axios from "axios";

import constants from "../../../config";

export default async function fetchBrands(page = 0) {
  try {
    const url = `${constants.localApi}/brands?page=${page}`;
    const { data: { brands, pages: totalPages } } = await axios.get(url);

    return { brands, totalPages };
  } catch (e) {
    console.error(e);
  }
}
