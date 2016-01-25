"use strict";

let express = require('express');
let productController = require('../controllers/productController')();
let productRouter = express.Router();

productRouter.route('/Product/insert')
    .post(productController.InsertGame);

productRouter.route('/Product/search')
    .get(productController.Search);

productRouter.route('/Product/getgames')
    .get(productController.GetGames);

productRouter.route('/Product/:id')
    .get(productController.GetGameById);

productRouter.route('/Product/update')
    .put(productController.UpdateGame);

productRouter.route('/Product/delete')
    .delete(productController.DeleteGame);

module.exports = productRouter;