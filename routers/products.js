import express from 'express';
import Products from '../schemas/products.js';

const router = express.Router();

//GET/products
router.get('/', async (req,res) => {
    const responseProducts = await Products.find({},{
        _id: 1,
        name: 1, 
        description: 1, 
        manager: 1, 
        status: 1, 
        createdAt: 1, 
        updatedAt: 1 
    }).exec();
    res.status(200).json({
        status: 200,
        message: '상품 목록 조회에 성공했습니다.',
        date: responseProducts
    });
})

//GET/products/:id
router.get('/:id', async (req,res) => {
    const params = req.params;
    const productId = params.id;

    console.log('전달받은 id', productId);

    const productItem = await Products.find({ _id: productId}, {
        _id: 1,
        name: 1, 
        description: 1, 
        manager: 1, 
        status: 1, 
        createdAt: 1, 
        updatedAt: 1 
    }).exec();

    return res.status(200).json({
        status: 200,
        message: '상품 상세 조회에 성공했습니다.',
        date : productItem,
    });
})

//POST/products
router.post('/', async (req, res) => {
    const { name, description, manager, password } = req.body;
  
    const productName = await Products.find({ name }).exec();
    if (productName.length) {
      return res
        .status(400)
        .json({ success: false, errorMessage: '이미 등록 된 상품입니다.' });
    }

    //400 상품 정보를 모두 입력해 주세요. required 에러 이용
  
    const createdProducts = await Products.create({
      name,
      description,
      manager,
      password,
      status : 'FOR_SALE',
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
        date: responseProducts
    });
  });

export default router;