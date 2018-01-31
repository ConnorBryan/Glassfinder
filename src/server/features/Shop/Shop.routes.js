import express from "express";

import { ShopController } from "./";

export const client = api => {
  const ShopRouter = express.Router();

  ShopRouter.get("/", ShopController.read);
  ShopRouter.get("/:id", ShopController.read);
  ShopRouter.get("/:id/pieces", ShopController.fetchPiecesForId);
  ShopRouter.get("/mapmarkers", ShopController.fetchMapMarkers);

  api.use("/shops", ShopRouter);
};

export const admin = api => {
  const ShopAdminRouter = express.Router();

  ShopAdminRouter.get("/", ShopController.readAll);
  ShopAdminRouter.delete("/:id", ShopController.remove);

  api.use("/shops", ShopAdminRouter);
};
