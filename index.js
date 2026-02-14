const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/user-gamepasses/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // 1️⃣ Obtener universes del usuario
        const gamesResponse = await axios.get(
            `https://games.roblox.com/v2/users/${userId}/games`,
            {
                params: {
                    accessFilter: "Public",
                    limit: 50
                }
            }
        );

        const universes = gamesResponse.data.data;

        let allPasses = [];

        // 2️⃣ Para cada universe obtener gamepasses
        for (const game of universes) {
            const universeId = game.id;

            try {
                const passesResponse = await axios.get(
                    `https://apis.roblox.com/game-passes/v1/universes/${universeId}/game-passes`,
                    {
                        params: {
                            passView: "Full",
                            pageSize: 100
                        }
                    }
                );

                const passes = passesResponse.data.gamePasses;

                for (const pass of passes) {
                    if (pass.isForSale && pass.price) {
                        allPasses.push(pass);
                    }
                }

            } catch (err) {
                console.log(`Failed universe ${universeId}`);
            }
        }

        res.json({
            success: true,
            count: allPasses.length,
            data: allPasses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.status || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
});
