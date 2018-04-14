import * as config from "../../../config";
import { requireProperties, success, error } from "../../../util";

import models from "../../database/models";

const { ShopToBrand, Artist, Brand } = models;

export default class ShopToBrandController {
  static getAssociatedBrands = async (req, res) => {
    try {
      const { id } = req.params;

      requireProperties({ id });

      const brands = await ShopToBrand.findAll({ where: { shopId: id } });

      return success(
        res,
        `Successfully fetched associated brands for Shop#${id}`,
        {
          brands
        }
      );
    } catch (e) {
      console.error(e);
      return error(res, e);
    }
  };

  static associateShopWithBrand = async (req, res) => {
    try {
      const { id, brandId } = req.params;

      requireProperties({ id, brandId });

      // Does the association already exist?
      const existingShopToBrand = await ShopToBrand.findOne({
        where: { shopId: id, brandId }
      });

      if (existingShopToBrand) {
        return error(
          res,
          `Shop#${id} and Brand#${brandId} are already associated.`
        );
      }

      const association = await ShopToBrand.create({
        shopId: id,
        brandId
      });

      return success(
        res,
        `Successfully associated Shop#${id} and Brand#${brandId}.`,
        {
          association
        }
      );
    } catch (e) {
      console.error(e);
      return error(res, e);
    }
  };
}
