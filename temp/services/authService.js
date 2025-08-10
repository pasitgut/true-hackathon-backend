const pool = require("../db");


// const getFamilyById = async (id) => {
//     const result = await pool.query('SELECT * FROM family WHERE id = $1', [id]);
//     return result.rows[0]
// }

// const createFamily = async (familyName, ownerId) => {
//     const result = await pool.query('INSERT INTO family (family_name, ownerId) VALUES($1, $2)', [familyName, ownerId]);

//     return result.rows[0];
// }

// const updateFamily = async () => {

// }

// const deleteFamily = async (familyId) => {
//     await pool.query('DELETE FROM family WHERE id = $1', [familyId]);
// }

// module.exports = {
//     getFamilyById,
//     createFamily,
//     updateFamily,
//     deleteFamily
// }

const login = async (email, password) => {
    const userRes = await pool.query('SELECT password FROM user WHERE username = $1', [email]);
    const user = userRes.rows[0];

    if (!user) throw new Error("Invalid credentials")

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    return { token, user: { id: user.id, email: user.email }};
}

const register = async (email, password) => {
    const userCheck = await pool.query('SELECT email FROM user WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query('INSERT INTO user (email, password) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword]);

    return newUser.rows[0];
}