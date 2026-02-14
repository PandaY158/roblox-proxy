const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/gamepasses/:universeId", async (req, res) => {
    try {
        const universeId = req.params.universeId;

        const response = await axios.get(
            `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100&sortOrder=Asc`
        );

        res.json({
            success: true,
            count: response.data.data.length,
            data: response.data.data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.status || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
