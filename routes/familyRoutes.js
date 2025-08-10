import express from "express";
import pool from "../db.js";

const familyRouter = express.Router();


familyRouter.post('/create', async (req, res) => {
   try {
     const { family_name, user_id } = req.body;

    const existingFamily = await pool.query('SELECT * FROM users WHERE user_id = $1 AND family_id IS NOT NULL', [user_id]);

    if (existingFamily.rows.length > 0) {
        return res.status(400).json({ error: 'User already family'});
    }

    const newFamily = await pool.query('INSERT INTO families (family_name, owner_id) VALUES ($1, $2) RETURNING *', [family_name, user_id]);
        console.log("create family: ", newFamily);
    if (newFamily.rows.length === 0) {
        return res.status(400).json({ error: 'Create family failed' });
    }
    const updateFamily = await pool.query('UPDATE users SET family_id = $1 WHERE user_id = $2 RETURNING *' , [newFamily.rows[0].family_id, user_id]);
    console.log("update family: ", updateFamily);
    if (updateFamily.rows.length === 0) {
        return res.status(400).json({ error: 'Update family id failed'});
    }
    res.status(201).json({ family: newFamily.rows[0] })
    
   } catch (error) {
    console.error(error);
    res.status(500).json({ erorr: 'Server error'});
   }
})


familyRouter.post('/invite', async (req, res) => {
    try {
        const { family_id, sender_id, phone } = req.body;

        const existingMember = await pool.query('SELECT * FROM users WHERE family_id = $1 AND phone = $2', [family_id, phone]);

        if (existingMember.rows.length > 0) {
            return res.status(400).json({ error: 'User is already a family member'});
        }

        const user = await pool.query('SELECT user_id FROM users WHERE phone = $1', [phone]);
        const existingInvitation = await pool.query('SELECT * FROM invitations WHERE family_id = $1 AND recipient_id = $2 AND status = $3', [family_id, user.rows[0].user_id, 'pending']);

        if (existingInvitation.rows.length > 0) {
            return res.status(400).json({ error: 'Invatation already sent'});
        }

        const invitations = await pool.query('INSERT INTO invitations (family_id, sender_id, recipient_id, status) VALUES ($1, $2, $3, $4) RETURNING *', [family_id, sender_id, user.rows[0].user_id, 'pending']);

        res.status(201).json({
            message: 'Invitation sent successfully',
            invitation: invitations.rows[0],
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})


familyRouter.post('/invitation/', async (req, res) => {
    try {
        const userId = req.body.id;
        console.log(userId);
        const senderInvitation = await pool.query('SELECT i.*, u.username FROM invitations i JOIN users u on i.recipient_id = u.user_id WHERE sender_id = $1', [userId]);

        const recipientInvitation = await pool.query('SELECT i.*, u.username FROM invitations i JOIN users u on i.sender_id = u.user_id WHERE recipient_id = $1', [userId]);

        console.log('sender data: ', senderInvitation);
        console.log('recipient data: ', recipientInvitation);
        if (senderInvitation.rows.length === 0 && recipientInvitation.rows.length === 0) {
            return res.status(400).json({ error: "Not found invitation"});
        }
        if (senderInvitation.rows.length > 0 && recipientInvitation.rows.length === 0) {
            return res.status(200).json({ sender_data: senderInvitation.rows, recipient_data: []});
        }

        if (senderInvitation.rows.length === 0 && recipientInvitation.rows.length > 0) {
            return res.status(200).json({ recipient_data: recipientInvitation.rows, sender_data: []});
        }
        res.json({ sender_data: senderInvitation.rows, recipient_data: recipientInvitation.rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error"});
    }
})


familyRouter.put('/invitation/:id', async (req, res) => {
    try {
        const id  = req.params.id;
        const { user_id, status } = req.body; // accepted or declined

        const client = await pool.connect();
        await client.query('BEGIN')

        const invitation = await client.query('UPDATE invitations SET status = $1 WHERE id = $2 AND recipient_id = $3 AND status = $4 RETURNING *', [status, id, user_id, 'pending']);

        if (invitation.rows.length === 0) {
            await client.query("ROLLBACK")
            client.release();
            return res.status(404).json({ error: 'Invitation not found or already processed'});
        }

        if (status === 'accepted') {
            const family_id = invitation.rows[0].family_id;
            await client.query('UPDATE users SET family_id = $1 WHERE user_id = $2', [family_id, user_id]);
        }

        await client.query('COMMIT');
        client.release();

        res.json({ message: `Invitation ${status} successfully`});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error"});
    }
})

familyRouter.post('/my-family', async (req, res) => {
    try {
        const { user_id } = req.body;
        
        const existingFamily = await pool.query(`
            SELECT family_id FROM users WHERE user_id = $1`, [user_id]);
        
        if (existingFamily.rows[0].family_id == null) {
            return res.status(400).json({ error: "User haven't family"});
        }
        const familes = await pool.query(`SELECT * FROM users WHERE family_id = $1`, [existingFamily.rows[0].family_id]);
        
        if (familes.rows.length === 0) {
            return res.status(400).json({ error: "Family haven't member"});
        }

        res.json(familes.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


familyRouter.post('/block-website', async (req, res) => {
    const { user_id, family_id, url } = req.body;

    const result = await pool.query('INSERT INTO blacklist (added_by, family_id, url) VALUES ($1, $2, $3) RETURNING *', [user_id, family_id, url]);

    res.status(201).json({ data: result.rows[0] });
})


familyRouter.get('/block-website/:family_id', async (req, res) => {
    const family_id = req.params.family_id;
    const result = await pool.query('SELECT * FROM blacklist WHERE family_id = $1', [family_id]);
    if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Blacklist not found'});
    }

    res.status(200).json({ data: result.rows});
})


export default familyRouter;