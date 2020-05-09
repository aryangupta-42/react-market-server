/* eslint-disable no-console */
const response = require('../helper/response');

const successCode = 200;
const createCode = 201;
const userErrCode = 403;
const serverErrCode = 500;

const serverErrMessage = 'An internal error occurred, Please try again later';

function Core(model, field, admin = false) {
  const name = model.collection.collectionName;

  const getAll = async (_, res) => {
    let query = {};
    if (!admin) {
      query = {
        hidden: false,
      };
    }
    try {
      const results = await model.find(query);
      res.status(successCode).json(response(true, 'The following results were found: ', results));
    } catch (err) {
      console.log(err);
      res.status(serverErrCode).json(response(false, serverErrMessage, null));
    }
  };

  const getID = async (req, res) => {
    try {
      const result = await model.findById(req.params.id);
      res.status(successCode).json(response(true, `The following ${name} was found: `, result));
    } catch (err) {
      console.log(err);
      res.status(serverErrCode).json(response(false, serverErrMessage, null));
    }
  };

  const create = async (req, res) => {
    try {
      const result = await model.create(req.body);
      res.status(createCode).json(response(true, 'The following record was created: ', result));
    } catch (err) {
      console.log(err);
      res.status(serverErrCode).json(response(false, serverErrMessage, null));
    }
  };

  const updateID = async (req, res) => {
    if (req.user.access !== 'superadmin') {
      try {
        const searchRes = await model.findById(req.params.id);
        // eslint-disable-next-line no-underscore-dangle
        if (searchRes.addedBy.uid.equals(req.user._id)) {
          const updatedRes = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
          res.status(successCode).json(response(true, 'Details updated successfully', updatedRes));
        } else {
          res.status(userErrCode).json(response(false, 'Details can\'t be updated as you did not create them, Please contact the superadmin.', null));
        }
      } catch (err) {
        console.log(err);
        res.status(serverErrCode).json(response(false, serverErrMessage, null));
      }
    } else if (req.user.access === 'superadmin') {
      try {
        const updatedRes = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(successCode).json(response(true, 'Details updated successfully', updatedRes));
      } catch (err) {
        console.log(err);
        res.status(serverErrCode).json(response(false, serverErrMessage, null));
      }
    } else {
      res.status(userErrCode).json(response(false, 'Sorry you are not permitted to do this action.', null));
    }
  };

  const deleteID = async (req, res) => {
    if (req.user.access !== 'superadmin') {
      try {
        const searchRes = await model.findById(req.params.id);
        // eslint-disable-next-line no-underscore-dangle
        if (searchRes.addedBy.uid.equals(req.user._id)) {
          const deletedRes = await model.findByIdAndRemove(req.params.id);
          res.status(successCode).json(response(true, 'Record deleted successfully', deletedRes));
        } else {
          res.status(userErrCode).json(response(false, 'Record can\'t be deleted as you did not create it, Please contact the superadmin.', null));
        }
      } catch (err) {
        console.log(err);
        res.status(serverErrCode).json(response(false, serverErrMessage, null));
      }
    } else if (req.user.access === 'superadmin') {
      try {
        const deletedRes = await model.findByIdAndRemove(req.params.id);
        res.status(successCode).json(response(true, 'Record deleted successfully', deletedRes));
      } catch (err) {
        console.log(err);
        res.status(serverErrCode).json(response(false, serverErrMessage, null));
      }
    } else {
      res.status(userErrCode).json(response(false, 'Sorry you are not permitted to do this action.', null));
    }
  };

  return {
    getAll, getID, create, updateID, deleteID,
  };
}

module.exports = Core;