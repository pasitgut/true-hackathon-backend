// const familyService = require('../services/familyService');

// const getOne = async (req, res) => {
//     const id = parseInt(req.params.id);
//     const family = await familyService.getFamilyById(id);
//     if (!family) return res.status(404).json({ message: 'Family not found'});
//     res.json(family);
// }

// const create = async (req, res) => {
//     const { familyName, ownerId } = req.body;
//     const family = await familyService.createFamily(familyName, ownerId);
//     res.status(201).json(family);
// }

// const update = async (req, res) => {
//     const id = parseInt(req.params.id);
//     const { familyName } = req.body;
//     const family = await familyService.updateFamily(id, familyName);
//     if (!family) return res.status(404).json({ message: 'Family not found'});

//     res.json(family);
// }

// const remove = async (req, res) => {
//     const id = parseInt(req.params.id);
//     await familyService.deleteFamily(id);
//     res.status(204).send();
// }

// module.exports = {
//     getOne,
//     create,
//     update,
//     remove,
// }



const createFamily = async (req, res) => {
    const { familyName, userId } = req.body;

    try {

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getFamilyById = async (req, res) => {
    const familyId = req.params.familyId;
}

const inviteUserToFamily = async (req, res) => {
    const { familyId, senderId, receiveId } = req.body;
}

const accepteInvited = async (req, res) => {
    const { userId } = req.body;
}

const declineInvited = async (req, res) => {

}

const addWebsiteBlacklist = async (req, res) => {
    const { familyId, userId, url } = req.body; 
}

const getWebsiteBlackList = async (req, res) => {
    const familyId = req.params.familyId;
}

const reportSpam = async (req, res) => {

}
