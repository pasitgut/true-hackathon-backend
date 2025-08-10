const pool = require("../db");


const getFamilyById = async (id) => {
    const result = await pool.query('SELECT * FROM family WHERE id = $1', [id]);
    return result.rows[0]
}

const createFamily = async (familyName, ownerId) => {
    const result = await pool.query('INSERT INTO family (family_name, ownerId) VALUES($1, $2)', [familyName, ownerId]);

    return result.rows[0];
}

const updateFamily = async (familyName, familyId) => {
    const result = await pool.query('UPDATE family set familyName = $1 WHERE familyId = $2', [familyName, familyId]);
    return result.rows[0];
}

const deleteFamily = async (familyId) => {
    await pool.query('DELETE FROM family WHERE id = $1', [familyId]);
}

module.exports = {
    getFamilyById,
    createFamily,
    updateFamily,
    deleteFamily
}