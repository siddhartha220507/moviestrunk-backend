const axios = require("axios");

const celebrityMatch = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const base64Image = req.file.buffer.toString('base64');

        const response = await axios.post(
            "https://api.clarifai.com/v2/users/clarifai/apps/main/models/celebrity-face-recognition/outputs",
            {
                user_app_id: {
                    user_id: "clarifai",
                    app_id: "main"
                },
                inputs: [
                    {
                        data: {
                            image: { base64: base64Image }
                        }
                    }
                ]
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Key ${process.env.CLARIFAI_API_KEY}`
                }
            }
        );

        const aiData = response.data.outputs[0].data;
        let celeb = null;

        // Clarifai may return an empty concept as the first item (e.g. generic face label). Find the first named concept.
        let conceptList = [];
        if (aiData.regions && aiData.regions.length > 0) {
            conceptList = aiData.regions[0].data.concepts;
        } else if (aiData.concepts && aiData.concepts.length > 0) {
            conceptList = aiData.concepts;
        }

        celeb = conceptList.find(c => c.name && c.name.trim() !== "");

        if (!celeb) {
            return res.status(404).json({ message: "No celebrity match found in the image." });
        }

        // Return the top name and probability
        res.json({
            name: celeb.name,
            confidence: celeb.value
        });

    } catch (err) {
        console.error("Celebrity AI Error:", err.response?.data || err.message);
        res.status(500).json({
            message: "Celebrity detection failed. Please make sure you added a valid Clarifai API Key in the backend .env file.",
            error: err.response?.data || err.message
        });
    }
};

module.exports = {
    celebrityMatch
};
