const axios = require('axios');
const fs = require('fs');
const Caesar = require('caesar-salad').Caesar;
const sha1 = require('sha1');
const filename = ('answer.json');
const FormData = require('form-data');

require('dotenv/config');

const TOKEN = process.env.TOKEN;
const URL_GET = process.env.URL_GET;
const URL_POST = process.env.URL_POST+'?token='+TOKEN;

//Consuming API, sending request , getting and manipulation data and send response
axios.get(URL_GET, {
    params: {
        token: TOKEN
    }
  })
  .then(function (response) {
    var answer = response.data;  
     
    answer.decifrado = new Caesar(answer.numero_casas * -1).crypt(answer.cifrado.toLowerCase());
    answer.resumo_criptografico = sha1(answer.decifrado);

    fs.writeFileSync(filename, JSON.stringify(answer), (err) => {
      if (err) console.log('Error writing JSON file:', err)
    })
    console.log('New JSON file data:', answer) 

    var form = new FormData();
    const config = {headers:  form.getHeaders() };
    form.append('answer', fs.createReadStream(filename), { filename: 'answer.json'});  

    //Sending response
    axios.post(URL_POST, form, config)
      .then((res) => {
            //console.log(res.data);
            console.log('File answer.json send sucessfully! Your score: ', res.data.score);
      })
     .catch(function (err) {
        console.log('File answer.json not send. Error: ', err.response.data.message);
      })  
      .finally(function () {
        //Simply terminates the response 
      }); 

  })
  .catch(function (err) {
    console.log(err);
  })
  .finally(function () {
    //imply terminates the request 
  });  





