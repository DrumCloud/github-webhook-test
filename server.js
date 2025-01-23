const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const GITHUB_TOKEN = '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'; // Replace with your token

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    if (event === 'pull_request' && payload.action === 'opened') {
        const prNumber = payload.number;
        const repoName = payload.repository.full_name;

        try {
            // Get modified files in PR
            const filesResponse = await axios.get(
                `https://api.github.com/repos/${repoName}/pulls/${prNumber}/files`,
                {
                    headers: {
                        Authorization: `Bearer ${GITHUB_TOKEN}`
                    }
                }
            );

            const modifiedFiles = filesResponse.data;
            const jsonFiles = modifiedFiles.filter(file => file.filename.endsWith('.md'));

            for (const file of jsonFiles) {
                await axios.post(
                    `https://api.github.com/repos/${repoName}/pulls/${prNumber}/comments`,
                    {
                        body: `Review Note: This README file (${file.filename}) was modified. Please review.`,
                        path: file.filename,
                        position: 1 // Adjust position based on your requirement
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${GITHUB_TOKEN}`
                        }
                    }
                );
                console.log(`Added review comment for file: ${file.filename}`);
            }
            res.status(200).send('Comments added!');
        } catch (error) {
            console.error('Error handling webhook:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(200).send('Webhook received!');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
