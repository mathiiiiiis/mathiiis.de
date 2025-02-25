const express = require('express');
const app = express();

app.get('/api/discord-profile/:userId', async (req, res) => {
    const fetch = (await import('node-fetch')).default;
    try {
        const response = await fetch(`https://discord.com/api/v9/users/${req.params.userId}`, {
            headers: { 'Authorization': `Bot ${DISCORD_BOT_TOKEN}` }
        });
        if (response.ok) {
            const data = await response.json();
            res.json({
                avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${req.params.userId}/${data.avatar}.png` : null,
            });
        } else {
            res.status(response.status).json({ error: 'Failed to fetch Discord data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));