const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    if (event === 'pull_request' && payload.action === 'opened') {
        const prNumber = payload.number;
        const repoName = payload.repository.full_name;

        console.log(`PR #${prNumber} opened in ${repoName}.`);
        // Handle PR here
    }

    res.status(200).send('Webhook received!');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));