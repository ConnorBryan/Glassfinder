import passport from "passport";
import uuid from "uuid/v4";

import * as config from "../../../config";
import {
  respondWith,
  requireProperties,
  error,
  success,
  userNotFound,
  userNotLinked,
  CRUR
} from "../../../util";
import multerS3 from "../../../util/upload";
import {
  createSafePassword,
  confirmPassword,
  verificationMailOptions
} from "../../passport";
import models from "../../database/models";
import transporter, {
  glassfinder,
  slightlyBiggerText
} from "../../transporter";
import { genericSortedRead, genericPaginatedRead } from "../common";

const upload = multerS3(config.USER_BUCKET);
const { Shop, Artist, Brand, Piece, User, LinkRequest } = models;

const crurConfig = {
  Model: User,
  modelName: "User",
  collection: "users"
};

function adminCreate(req, res) {
  return CRUR.create(req, res, crurConfig);
}

function adminRead(req, res) {
  return CRUR.read(req, res, crurConfig);
}

function adminUpdate(req, res) {
  return CRUR.update(req, res, crurConfig);
}

function adminRemove(req, res) {
  return CRUR.remove(req, res, crurConfig);
}

/**
 * @func signup
 * @desc An aliased wrapper for passport's "local-signup" strategy.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 * @param {ExpressNext} next 
 * @returns {number} id - A unique identifier for the newly created User.
 */
function signup(req, res, next) {
  return passport.authenticate("local-signup", (err, id) => {
    return err ? error(res, err) : success(res, "Sign up successful", { id });
  })(req, res, next);
}

/**
 * @func signin
 * @desc An aliased wrapper for passport's "local-login" strategy.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 * @param {ExpressNext} next
 * @returns {string} token - A JWT used for accessing restricted resources.
 * @returns {object} data - Relevant User data for account management.
 */
function signin(req, res, next) {
  return passport.authenticate("local-login", (err, token, data) => {
    return err
      ? error(res, err)
      : success(res, "Sign in successful", {
          token,
          data
        });
  })(req, res, next);
}

/**
 * @func read
 * @desc Provides either a single or multiple instances of User.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 * @returns {User | Array<User>}
 */
function read(req, res) {
  return genericPaginatedRead(req, res, User, "user", "users");
}

/**
 * @deprecated
 * @func fetchPiecesForId
 * @desc Retrieve all pieces related to a particular User.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 * @returns {Array<Piece>}
 */
function fetchPiecesForId(req, res) {
  return genericSortedRead(
    req,
    res,
    Piece,
    config.LINK_TYPES_TO_RESOURCES[config.LINK_TYPES.PIECE],
    req.params.id
  );
}

/**
 * @func verify
 * @desc Elevate the permissions of a new User following email confirmation.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 */
function verify(req, res) {
  return respondWith(res, async () => {
    const { id } = req.params;
    const { verificationCode } = req.body;

    requireProperties({ id, verificationCode });

    const user = await User.findById(+id);

    switch (true) {
      case !user:
        return userNotFound(res);
      case user.verified:
        return error(res, `User#${id} is already verified`);
      case !user.verified && !user.verificationCode:
        return error(
          res,
          `User#${id} is not verified but no verification code is present`
        );
      case verificationCode !== user.verificationCode:
        return error(res, `The provided verification code was incorrect`);
    }

    await user.update({
      verified: true,
      verificationCode: null
    });

    return success(res, `Successfully verified User#${id}`);
  });
}

/**
 * @func resendVerification
 * @desc Send out a new email containing verification instructons.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 */
function resendVerification(req, res) {
  return respondWith(res, async () => {
    const { email } = req.body;

    requireProperties({ email });

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return userNotFound(res);
    } else if (user.verified) {
      return error(res, config.RESEND_VERIFICATION_USER_VERIFIED_ERROR);
    }

    const verificationCode = uuid();

    await user.update({ verificationCode });

    return transporter.sendMail(
      verificationMailOptions(email, user.id, verificationCode),
      err =>
        err
          ? error(res, err)
          : success(res, `Successfully resent verification code for ${email}`)
    );
  });
}

/**
 * @func link
 * @desc Updates a User in the database to become associated with another Model.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 * @returns {object} data - User information with the new Model link embedded within.
 */
function link(req, res) {
  return respondWith(res, async () => {
    const { id } = req.params;
    const { type, config: bodyConfig } = req.body;

    requireProperties({ id, type, bodyConfig });

    const isValidType = config.LINK_TYPES[type];

    if (!isValidType) return error(res, `Invalid type ${type}`);

    const user = await User.findById(+id);

    switch (true) {
      case !user:
        return userNotFound(res);
      case user.linked:
        return error(res, `User#${id} is already linked as ${user.type}`);
    }

    const parsedConfig = JSON.parse(bodyConfig);

    // Send out the request to be confirmed.
    user.requestLink(type, JSON.stringify(parsedConfig));

    // const link = await user.linkAs(type, parsedConfig);
    const data = {
      id: user.id,
      email: user.email,
      type: user.type,
      linked: true,
      link: null
    };

    return transporter.sendMail(
      linkRequestMail(user.email, type),
      err =>
        err
          ? error(res, err)
          : success(res, `Successfully linked User#${id} as ${type}`, { data })
    );
  });
}

/**
 * @func update
 * @desc Potentially updates all safe fields of a User's linked Model with some or all new values.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 * @returns {object} link - The User's new, updated linked model.
 */
function update(req, res) {
  return respondWith(res, async () => {
    const { id } = req.params;
    const { values } = req.body;

    requireProperties({ id, values });

    const user = await User.findById(+id);

    switch (true) {
      case !user:
        return userNotFound(res);
      case !user.linked:
        return userNotLinked(res);
    }

    const parsedValues = JSON.parse(values);
    const Model = fetchLinkedModel(user);

    await Model.update(parsedValues, {
      where: { userId: id }
    });

    const link = await Model.findOne({ where: { userId: id } });

    return success(
      res,
      `Successfully updated info for User#${id} as ${user.type}`,
      {
        link
      }
    );
  });
}

/**
 * @func updatePassword
 * @desc Adjust the "password" field of a single User.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 */
function updatePassword(req, res) {
  return respondWith(res, async () => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    requireProperties({ id, currentPassword, newPassword });

    const user = await User.findById(+id);

    if (!user) return userNotFound(res);

    const { password: actualPassword } = user;
    const passwordsMatch = await confirmPassword(
      currentPassword,
      actualPassword
    );

    if (!passwordsMatch) return error(res, "Invalid user or password");

    await user.update({ password: await createSafePassword(newPassword) });

    return success(res, "Password successfully updated");
  });
}

/**
 * @func uploadImage
 * @desc Replace the primary image of a User's linked Model.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 * @returns {object} link - The User's new, updated linked model.
 */
function uploadImage(req, res) {
  return respondWith(res, async () => {
    const { id } = req.params;

    requireProperties({ id });

    const user = await User.findById(+id);

    switch (true) {
      case !user:
        return userNotFound(res);
      case !user.linked:
        return userNotLinked(res);
    }

    return upload(req, res, async err => {
      if (err) return error(res, err);

      const { file: { key } } = req;
      const Model = fetchLinkedModel(user);

      await Model.update(
        { image: `${config.USER_IMAGES_SPACES_URL}/${key}` },
        { where: { userId: id } }
      );

      const link = await Model.findOne({ where: { userId: id } });

      return success(res, `Successfully updated info for User#${id}`, {
        link
      });
    });
  });
}

/**
 * @func fetchMyPieces
 * @desc Retrieve paginated Pieces associated with a given User.
 * @param {ExpressRequest} req 
 * @param {ExpressResponse} res 
 * @returns {number} count - How many total Pieces are associated with the User
 * @returns {number} pages - How many total pages of Pieces there are
 * @returns {Array<Piece>}
 */
function fetchMyPieces(req, res) {
  return respondWith(res, async () => {
    const { id } = req.params;
    const { page } = req.query;

    requireProperties({ id, page });

    const coercedPage = +(page || 0);
    const limit = config.MODEL_READ_LIMIT;
    const offset = coercedPage * limit;
    const { count, rows: pieces } = await Piece.findAndCountAll({
      where: { userId: +id },
      offset,
      limit,
      $sort: { id: 1 }
    });
    const pages = Math.ceil(count / limit);

    return success(res, `Successfully read pieces for User#${id}`, {
      count,
      pages,
      pieces
    });
  });
}

/* === */

/**
 * @func fetchLinkedModel
 * @desc Translates a User's type into a Sequelize Model to use for querying.
 * @param {string} type
 * @returns {SequelizeModel} Model
 */
function fetchLinkedModel({ type }) {
  const models = {
    [config.LINK_TYPES.SHOP]: Shop,
    [config.LINK_TYPES.ARTIST]: Artist,
    [config.LINK_TYPES.BRAND]: Brand
  };
  const Model = models[type];

  if (!Model) throw Error(`Unable to get linked model with type ${type}`);

  return Model;
}

export default {
  adminCreate,
  adminRead,
  adminUpdate,
  adminRemove,
  signup,
  signin,
  read,
  updatePassword,
  link,
  update,
  uploadImage,
  verify,
  resendVerification,
  fetchMyPieces,
  fetchPiecesForId
};

function getPhrase(type) {
  const model = type.toLowerCase();

  return type === config.LINK_TYPES.ARTIST ? `an ${model}` : `a ${model}`;
}

function linkRequestMail(email, type) {
  const phrase = getPhrase(type);

  return {
    from: config.TRANSPORTER_EMAIL_ADDRESS,
    to: email.trim(),
    subject: `Your request to become ${phrase} is being processed`,
    html: composeMessage(type)
  };
}

function composeMessage(type) {
  const phrase = getPhrase(type);

  return `
    ${glassfinder}
    <p ${slightlyBiggerText}>We have received your request to become ${phrase}.</p>
    <p ${slightlyBiggerText}>Please allow 24-48 hours for your request to be processed.</p>
    <p ${slightlyBiggerText}>We will send you another email to notify you when a decision has been made.</p>
    <p ${slightlyBiggerText}>Thanks for using Glassfinder!</p>
  `;
}
