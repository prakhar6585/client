import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProduct, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'
import { resolveObjectURL } from 'buffer';

const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

router.get('/get-product', getProductController)

router.get('/get-product:/slug', getSingleProduct)

router.get('/product-photo/:pid', productPhotoController)

router.delete('/delete-product/:pid', deleteProductController)

// filer product 
router.post('/product-filter', productFiltersController)

// product count
router.get('/product-count', productCountController)

// product per page
router.get('/product-list/:page', productListController)

// search product
router.get('/search/:keywords', searchProductController)

// simittlar dprojfoi
router.get("/related-products/:pid/:c:id", relatedProductController);

// category wise product
router.get("/product-category/:slug", productCategoryController)

// payments route
// token 
router.get('/braintree/token', braintreeTokenController)

// payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController)

export default router;