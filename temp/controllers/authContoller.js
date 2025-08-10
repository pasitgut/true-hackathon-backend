// const authService = require("../services/authService");

// const register = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await authService.register(email, password);
//         res.status(201).json({ message: 'User registered', user});
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// }


// const login = async (req, res) => {
//     try {
//          const { email, password } = req.body;
//          const result = await authService.login(email, password);
//          res.json({ message: 'Login successful', ...result});
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// }


// module.exports = { register, login };


const login = async (req, res) => {
    const { email, password } = req.body;
}

const register = async (req, res) => {
    const { email, password } = req.body;
}