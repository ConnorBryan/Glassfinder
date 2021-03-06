import * as config from "../../../config";
import { requireProperties, success, error } from "../../../util";
import models from "../../database/models";
import {
  genericSortedRead,
  genericPaginatedRead,
  genericReadAll,
  genericRemove
} from "../common";

const { Artist, Piece } = models;

/**
 * @func read
 * @desc Provides either a single or multiple instances of Artist.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @returns {Artist | Array<Artist>}
 */
function read(req, res) {
  return genericPaginatedRead(req, res, Artist, "artist", "artists");
}

/**
 * @func readSorted
 * @desc Provides a page from a sorted collection.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @returns {Array<Artist>}
 */
function readSorted(req, res) {
  return genericSortedRead(
    req,
    res,
    Artist,
    config.LINK_TYPES_TO_RESOURCES[config.LINK_TYPES.ARTIST]
  );
}

/**
 * @func readPiecesSorted
 * @desc Provides a page from a sorted collection.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @returns {Array<Piece>}
 */
async function readPiecesSorted(req, res) {
  const { id } = req.params;

  requireProperties({ id });

  const { userId } = await Artist.findById(+id);

  return genericSortedRead(
    req,
    res,
    Piece,
    config.LINK_TYPES_TO_RESOURCES[config.LINK_TYPES.PIECE],
    userId
  );
}

/**
 * @func readAll
 * @desc Retrieves all instances of Artist.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @returns {Array<Artist>}
 */
function readAll(req, res) {
  return genericReadAll(req, res, Artist, "artists");
}

/**
 * @func remove
 * @desc Destroys an instance of Artist.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
function remove(req, res) {
  return genericRemove(req, res, Artist, "artist");
}

/* === */

async function getPiecesForArtist(req, res) {
  try {
    const { id } = req.params;

    // All of the Artist's User account's pieces
    const { userId } = await Artist.findById(+id);
    const usersPieces = await Piece.findAll({ where: { userId } });

    // All Pieces that are credited to the Artist
    const artistsPieces = await Piece.findAll({ where: { artistId: id } });

    return success(res, "Successfully retrieved all pieces for Artist", {
      fromUser: usersPieces,
      fromArtist: artistsPieces
    });
  } catch (e) {
    return error(res, "Whoops");
  }
}

/* === */

export default {
  read,
  readAll,
  readSorted,
  readPiecesSorted,
  remove,
  getPiecesForArtist
};
