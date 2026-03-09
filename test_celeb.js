const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testFaceAPI() {
    try {
        console.log("Downloading test image...");
        const response = await axios.get("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Tom_Cruise_by_Gage_Skidmore_2024.jpg/440px-Tom_Cruise_by_Gage_Skidmore_2024.jpg", { responseType: 'stream' });
        
        response.data.pipe(fs.createWriteStream('test_head.jpg'));
        
        response.data.on('end', async () => {
            console.log("Uploading to local backend API...");
            const formData = new FormData();
            formData.append('image', fs.createReadStream('test_head.jpg'));

            try {
                const apiRes = await axios.post("http://localhost:5000/api/celebrity", formData, {
                    headers: formData.getHeaders()
                });
                console.log("SUCCESS:");
                console.log(apiRes.data);
            } catch (err) {
                console.log("ERROR FROM BACKEND:");
                console.log(err.response?.data || err.message);
            }
        });
    } catch(e) {
        console.log("Error getting image:", e.message);
    }
}

testFaceAPI();
