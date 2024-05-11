import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'

const registerController = async (req, res) => {
    try {
        const { name, email, phone, password, address, answer } = req.body;
        //validation
        if (!name) { return res.send({ message: "Name is needed" }) };
        if (!email) { return res.send({ message: "Email is needed" }) };
        if (!phone) { return res.send({ message: "Phone is needed" }) };
        if (!password) { return res.send({ message: "Password is needed" }) };
        if (!address) { return res.send({ message: "Address is needed" }) };
        if (!answer) { return res.send({ message: "Answer is needed" }) }

        // checking user
        const existingUser = await userModel.findOne({ email });
        // existing user
        if (existingUser) {
            return res.status(200).send({ sucess: false, message: "Already Registered" });
        }
        // register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save();
        res.status(201).send({ success: true, message: "User Register Successfully", user })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // VALIDATION
        if (!email || !password) { return res.status(404).send({ success: false, message: "Invalid Credentials" }) };
        // CHECK USER
        const user = await userModel.findOne({ email });
        if (!user) { return res.status(404).send({ success: false, message: "Email is not registered" }) };
        const match = await comparePassword(password, user.password);
        if (!match) { return res.status(200).send({ success: false, message: "Invalid Password" }) };
        // TOKEN 
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECERET_KEY, { expiresIn: "30d" });
        res.status(200).send({ success: true, message: "Login successfull", user: { name: user.name, email: user.email, role: user.role, phone: user.phone }, token })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error in Login" })
    }

}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        //check
        const user = await userModel.findOne({ email, answer });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};

export const testController = (req, res) => {
    res.send("Protected Route");

}

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};

// orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting orders",
            error
        })
    }
}

// all orders 
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: "-1" })
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting all orders",
            error
        })
    }
}

// order status updation 
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in status order"
        })
    }

}

export default registerController