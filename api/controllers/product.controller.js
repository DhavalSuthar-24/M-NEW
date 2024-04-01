import { errorHandler } from "../utils/error.js";
import { Product } from "../models/product.model.js";

export const addProduct = async (req, res, next) => {
    try {
        // Check if the user is an admin
        if (!req.user.isAdmin) {
            return next(errorHandler(400, "You are not an admin"));
        }

        // Check if all required fields are provided
        const { title, content, image,image1,image2,category,price,quantity } = req.body;
        if (!title || !content || !image) {
            return next(errorHandler(400, "All fields are required"));
        }

        // Generate slug from the title
        const slug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');

        // Create a new product instance
        const newProduct = new Product({
            title,
            content,
            image,
            image1,
            image2,
            slug,
            price,
            quantity,
            category,
            userId: req.user._id // Assuming userId is provided in the request body or session
        });

        // Save the new product to the database
        const product = await newProduct.save();
        
        // Return the newly created product
        res.status(201).json(product);
    } catch (error) {
        // Pass any error to the error handling middleware
        next(error);
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        
        // Calculate the startIndex based on the requested page
        const startIndex = (page - 1) * limit;

        // Construct the query to fetch products for the requested page
        const query = {
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.productId && { _id: req.query.productId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        };

        // Fetch products for the requested page
        const products = await Product.find(query)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        // Fetch total number of products for pagination
        const totalProducts = await Product.countDocuments(query);

        // Fetch aggregated category counts
        const pipeline = [
            {
                $match: query // Use the same query for categories aggregation
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    count: 1
                }
            }
        ];

        const categoriesWithCounts = await Product.aggregate(pipeline);

        res.status(200).json({
            products,
            totalProducts,
            categories: categoriesWithCounts,
        });
    } catch (error) {
        next(error);
    }
};



export const getProduct = async(req,res,next)=>{
    try {
        // Extract the product ID from request parameters
        const productId = req.params.id;

        // Find the product by its ID in the database
        const product = await Product.findById(productId);

        // If product is not found, return 404 Not Found error
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        // If product is found, return it
        res.status(200).json(product);
    } catch (error) {
        // Pass any error to the error handling middleware
        next(error);
    }
}