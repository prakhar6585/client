import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import catetgoryRoutes from './routes/categoryRoutes.js'
import cors from 'cors'
import productRoutes from './routes/productRoute.js'

// configure's
dotenv.config();
connectDB();


//rest object
const app = express();

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', catetgoryRoutes)
app.use('/api/v1/product', productRoutes)

app.get('/', (req, res) => {
    res.send("<h1>E-commerce App</h1>")
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`.bgGreen.white);
})