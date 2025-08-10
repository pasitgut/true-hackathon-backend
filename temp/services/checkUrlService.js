const blacklistUrls = [ 'http://malicious.com', 'http://bad-site.com'];

const express = require("express");
const app = express();

app.post('/check-url', (req, res) => {
    const { url } = req.body;

    const isHttp = url.startsWith("http://");
    const isBlackedlisted = blacklistUrls.includes(url);

    if (isHttp || isBlackedlisted) {
        return res.json({ safe: false, reason: isHttp ? 'Non-HTTPS' : 'Blacklisted'});
    }

    return res.json({ safe: true });
})


// const [url, setUrl] = useState('');
// const [result, setResult] = useState(null);

// const checkURL = async () => {
//   const res = await fetch('/check-url', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ url }),
//   });
//   const data = await res.json();
//   setResult(data);
// };
// popup = alert() or react-modal / MUI Dialog 

