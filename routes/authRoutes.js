import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js'

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
        console.log(existingUser);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists'});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query('INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, phone, hashedPassword]);
        console.log('New Usere', newUser);
        const token = jwt.sign(
            { id: newUser.rows[0].user_id},
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d', }
        )
        
        res.status(201).json({ 
            token, 
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows[0].length === 0) {
            return res.status(400).json({ error: 'Invalid credentials'});
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.rows[0].user_id},
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        )

        const { password: _, ...userWithoutPassword} = user.rows[0];

        res.json({
            token,
            user: userWithoutPassword
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error'});
    }
})


authRouter.get('/profile/:id', async (req, res) => {
    try {
        console.log("Req: ", req);
        const id = req.params.id;
        console.log('ID: ', id);
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'User not found'});
        }
        res.json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erorr: "Server error" });
    }
})

export default authRouter;