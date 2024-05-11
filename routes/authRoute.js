import express from "express";
import registerController, { forgotPasswordController, getAllOrdersController, getOrdersController, loginController, orderStatusController, testController, updateProfileController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// register route
router.post('/register', registerController)
// login route
router.post('/login', loginController)
//forgot password
router.post('/forgot-password', forgotPasswordController);

// test route
router.get('/test', requireSignIn, isAdmin, testController);

// protected user route
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

// protection admin route
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

//update profile
router.put('/profile', requireSignIn, updateProfileController)

// orders
router.get('/orders', requireSignIn, getOrdersController)

// all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

// order status updation 
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)
export default router