import express from 'express';

const checkUrlRouter = express.Router();

const blacklistUrls = [ 'https://malicious.com', 'https://bad-site.com'];
checkUrlRouter.post('/', async (req, res) => {
    const { url } = req.body;

    const isHttp = url.startsWith("http://");
    const isBlacklisted = blacklistUrls.includes(url);

    if (isHttp || isBlacklisted) {
        return res.json({ safe: false, reason: isHttp ? 'Non-HTTPS' : 'Blacklisted'})
    }

    res.json({ safe: true });
})

export default checkUrlRouter;