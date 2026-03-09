const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

async function run() {
  const b = fs.readFileSync('test_face.jpg').toString('base64');
  const res = await axios.post('https://api.clarifai.com/v2/users/clarifai/apps/main/models/celebrity-face-recognition/outputs', 
    {user_app_id:{user_id:'clarifai',app_id:'main'},inputs:[{data:{image:{base64:b}}}]},
    {headers:{'Authorization':'Key '+process.env.CLARIFAI_API_KEY}});
  fs.writeFileSync('output.json', JSON.stringify(res.data, null, 2));
  console.log("Written output.json");
}
run();
