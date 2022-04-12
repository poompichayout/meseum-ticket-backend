import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config()
const SECRET: string = process.env.SECRET!;

import User from 'app/models/UserModel';

export const signin = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email })

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect  = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

        //If crednetials are valid, create a token for the user
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" })
        
        //Then send the token to the client/frontend
        res.status(200).json({ result: existingUser, token })
	} catch (error) {
		res.status(500).json({ message: "Something went wrong"})
	}
}

export const signup = async (req: Request, res: Response)=> {
    const { email, password, confirmPassword, firstName, lastName, phone } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if(existingUser) return res.status(400).json({ message: "User already exist" })

        if(password !== confirmPassword) return res.status(400).json({ message: "Password don't match" })
        
        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({ email, password: hashedPassword, firstname: firstName, lastname: lastName, phone })

        const token = jwt.sign({ email: result.email, id: result._id }, SECRET, { expiresIn: "1h" })
        
        res.status(200).json({ result, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong"}) 
    }
}