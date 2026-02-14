const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/gamepasses/:universeId", async (req, res) => {
    const universeId = req.params.universeId;

    try {
        const response = await axios.get(
            `https://apis.roblox.com/game-passes/v1/universes/${universeId}/game-passes`,
            {
                params: {
                    passView: "Full",
                    pageSize: 100
                }
            }
        );

        res.json({
            success: true,
            data: response.data.gamePasses
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
