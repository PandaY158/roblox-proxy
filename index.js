const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/gamepasses/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Obtener juegos del usuario
        const gamesResponse = await axios.get(
            `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50&sortOrder=Asc`
        );

        let allPasses = [];

        for (const game of gamesResponse.data.data) {
            const universeId = game.id;

            const passesResponse = await axios.get(
                `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100&sortOrder=Asc`
            );

            allPasses.push(...passesResponse.data.data);
        }

        res.json({
            success: true,
            count: allPasses.length,
            data: allPasses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
