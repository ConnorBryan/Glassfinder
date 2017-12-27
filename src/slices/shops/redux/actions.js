import { displayWarning } from "../../../redux/actions";
import services from "../services";

// Actions
export const FETCH_SHOPS_SUCCESS = "FETCH_SHOPS_SUCCESS";
export const FETCH_SHOPS_FAILURE = "FETCH_SHOPS_FAILURE";
export const SET_FETCH_SHOPS_PAGE = "SET_FETCH_SHOPS_PAGE";
export const SET_SHOPS_FETCHING = "SET_SHOPS_FETCHING";
export const FETCH_SHOP_SUCCESS = "FETCH_SHOP_SUCCESS";
export const FETCH_SHOP_FAILURE = "FETCH_SHOP_FAILURE";

// Action Creators
export const fetchShopsSuccess = shops => ({
  type: FETCH_SHOPS_SUCCESS,
  payload: { shops }
});
export const fetchShopsFailure = () => ({ type: FETCH_SHOPS_FAILURE });
export const setFetchShopsPage = page => ({
  type: SET_FETCH_SHOPS_PAGE,
  payload: { page }
});
export const setShopsFetching = fetching => ({
  type: SET_SHOPS_FETCHING,
  payload: { fetching }
});
export const fetchShopSuccess = shop => ({
  type: FETCH_SHOP_SUCCESS,
  payload: { shop }
});
export const fetchShopFailure = () => ({
  type: FETCH_SHOP_FAILURE
});

// Action Handlers
export const fetchShops = () => async (dispatch, getState) => {
  try {
    dispatch(setShopsFetching(true));

    const { page } = getState();
    const shops = await services.fetchShops(page);

    dispatch(fetchShopsSuccess(shops));
  } catch (e) {
    dispatch(fetchShopsFailure());
    dispatch(
      displayWarning({
        header: "Unable to fetch shops",
        content: e.toString()
      })
    );
  }
};

export const fetchShop = id => async (dispatch, getState) => {
  try {
    dispatch(setShopsFetching(true));

    const shop = await services.fetchShop(id);

    dispatch(fetchShopSuccess(shop));
  } catch (e) {
    dispatch(fetchShopFailure());
    dispatch(
      displayWarning({
        header: "Unable to fetch shop",
        content: e.toString()
      })
    );
  }
};
