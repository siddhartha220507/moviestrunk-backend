const axios = require('axios');
const fs = require('fs');

async function directClarifaiTest() {
    try {
        const imageBytes = fs.readFileSync('test_face.jpg');
        const base64Image = imageBytes.toString('base64');
        
        console.log("Image size:", base64Image.length, "bytes");

        // Use the PAT for the Authorization Header
        const response = await axios.post(
            // Use the clarify user namespace and main app for the public celebrity model
            "https://api.clarifai.com/v2/users/clarifai/apps/main/models/celebrity-face-recognition/outputs",
            JSON.stringify({
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
            }),
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Key " + process.env.CLARIFAI_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );
        
        console.log("Success! Regions found:", response.data.outputs[0].data.regions?.length);
        if (response.data.outputs[0].data.regions?.length > 0) {
            console.log("Top Celeb:", JSON.stringify(response.data.outputs[0].data.regions[0].data.concepts[0], null, 2));
        } else if (response.data.outputs[0].data.concepts?.length > 0) {
            console.log("Top Celeb Concept:", JSON.stringify(response.data.outputs[0].data.concepts[0], null, 2));
        } else {
            console.log(response.data.outputs[0]);
        }
    } catch (e) {
        console.error("Clarifai direct API failed:", e.response?.data || e.message);
    }
}

require('dotenv').config();
directClarifaiTest();
