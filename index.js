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

app.get("/gamepasses/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const response = await axiosInstance.get(
            `https://inventory.roblox.com/v1/users/${userId}/assets/collectibles?limit=100`
        );

        // Filtrar solo GamePass (AssetTypeId 34)
        const gamepasses = response.data.data.filter(asset => asset.assetTypeId === 34);

        res.json({
            success: true,
            count: gamepasses.length,
            data: gamepasses
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
