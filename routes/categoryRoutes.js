import express from 'express';
import { isAdmin, requireSignIn } from './..//middlewares/authMiddleware.js'
import { categoryController, createCategoryController, deleteCategoryConroller, singeCategoryController, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router();

// create category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

// update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

// get all category
router.get('/get-category', categoryController)

// get single category
router.get('/single-category/:slug', singeCategoryController)

// gelete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryConroller)

export default router;