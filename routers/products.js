import express from 'express';
import Products from '../schemas/products.js';
import Joi from 'joi';

const router = express.Router();

const createProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    manager: Joi.string().required(),
    password: Joi.string().required(),
});

const updateProductSchema = Joi.object({
    name : Joi.string(),
    description: Joi.string(),
    manager : Joi.string(),
    status: Joi.string().valid('FOR_SALE', 'SOLD_OUT'),
    password: Joi.string().required()
});

const deleteProductSchema = Joi.object({
    password: Joi.string().required()
});

//GET/products
router.get('/', async (req, res, next) => {
    try {
        const responseProducts = await Products.find(
            {},
            {
                _id: 1,
                name: 1,
                description: 1,
                manager: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        ).sort({ createdAt: -1 }).exec();

        if (!responseProducts) {        //상품이 존재하지 않을 시 빈 배열 반환
            return res.status(200).json({
                date: []
            });
        }

        return res.status(200).json({
            status: 200,
            message: '상품 목록 조회에 성공했습니다.',
            date: responseProducts,
        });
    } catch (error) { next(error); }
});

//GET/products/:id
router.get('/:id', async (req, res, next) => {
    try {
        const params = req.params;
        const productId = params.id;

        console.log('전달받은 id', productId);

        const productItem = await Products.findOne(
            { _id: productId },
            {
                _id: 1,
                name: 1,
                description: 1,
                manager: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        ).exec();

        if (!productItem) {
            return res.status(404).json({
                status: 404,
                message: '상품이 존재하지 않습니다.'
            });
        }

        return res.status(200).json({
            status: 200,
            message: '상품 상세 조회에 성공했습니다.',
            date: productItem,
        });
    } catch (error) { next(error); }
});

//POST/products
router.post('/', async (req, res, next) => {
    try {
        const { name, description, manager, password } = req.body;

        await createProductSchema.validateAsync(req.body);

        const productName = await Products.find({ name }).exec();
        if (productName.length) {
            return res.status(400).json({ errorMessage: '이미 등록 된 상품입니다.' });
        }

        const createdProducts = await Products.create({
            name,
            description,
            manager,
            password,
            status: 'FOR_SALE',
        });

        const responseProducts = {
            id: createdProducts._id,
            name: createdProducts.name,
            description: createdProducts.description,
            manager: createdProducts.manager,
            status: createdProducts.status,
            createdAt: createdProducts.createdAt,
            updatedAt: createdProducts.updatedAt,
        };

        return res.status(201).json({
            status: 201,
            message: '상품 생성에 성공했습니다.',
            date: responseProducts,
        });
    } catch (error) { next(error); }
});

//PUT/products/:id
router.put('/:id', async (req, res, next) => {
    try {
        const params = req.params;
        const productId = params.id;

        const { name, description, manager, status, password } = req.body;

        await updateProductSchema.validateAsync(req.body);

        const productItem = await Products.findOne({ _id: productId },
            {
                _id: 1,
                name: 1,
                description: 1,
                manager: 1,
                password : 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
            }).exec();

        if (!productItem) {
            return res.status(400).json({
                status: 400,
                message: '상품이 존재하지 않습니다.'
            });
        }

        if (password !== productItem.password) {
            return res.status(401).json({
                status: 401,
                massage: '비밀번호가 일치하지 않습니다.'
            });
        }

        const updateProduct = {};
        if (name) updateProduct.name = name;
        if (description) updateProduct.description = description;
        if (manager) updateProduct.manager = manager;
        if (status) updateProduct.status = status;
        updateProduct.updatedAt = new Date();

        await Products.findByIdAndUpdate(productId, updateProduct).exec();

        const newProductItem = await Products.findOne(
            { _id: productId },
            {
                _id: 1,
                name: 1,
                description: 1,
                manager: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        ).exec();

        return res.status(200).json({
            status: 200,
            message: '상품 수정에 성공했습니다.',
            date: newProductItem
        })
    } catch (error) { next(error); }
});

//DELETE/products/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const params = req.params;
        const productId = params.id;
        const { password } = req.body;

        await deleteProductSchema.validateAsync(req.body);

        const productItem = await Products.findOne({ _id: productId },
            {
                _id: 1,
                password: 1,
            }).exec();

        if (!productItem) {
            return res.status(404).json({
                status: 404,
                message: '상품이 존재하지 않습니다.'
            });
        }

        if (password !== productItem.password) {
            return res.status(401).json({
                status: 401,
                message: '비밀번호가 일치하지 않습니다.'
            });
        }

        await Products.deleteOne({ _id: productId }).exec();

        return res.status(200).json({
            status: 200,
            message: '상품 삭제에 성공했습니다.',
            date: {
                id: productItem._id,
            }
        });
    } catch (error) { next(error); }
});

export default router;
