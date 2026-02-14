const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

const axiosInstance = axios.create({
    headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
    }
});

app.get("/gamepasses/:placeId", async (req, res) => {
    try {
        const placeId = req.params.placeId;

        // 1️⃣ Convertir PlaceId → UniverseId
        const placeResponse = await axiosInstance.get(
            `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`
        );

        const universeId = placeResponse.data[0].universeId;

        if (!universeId) {
            return res.json({ success: false, error: "Invalid PlaceId" });
        }

        // 2️⃣ Obtener gamepasses del universe
        const passesResponse = await axiosInstance.get(
            `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100&sortOrder=Asc`
        );

        res.json({
            success: true,
            universeId: universeId,
            count: passesResponse.data.data.length,
            data: passesResponse.data.data
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
