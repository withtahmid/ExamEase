const axios = require('axios');
const URL = {
    textMatch:'http://127.0.0.1:5000/api/textsimilarity',
    toText:'http://127.0.0.1:5000/api/speechtotext',
    faceMatch: 'http://127.0.0.1:5000/api/facematch',
    validDp: 'http://127.0.0.1:5000/api/validdp'
};
const config = {
  headers: {
    TOKEN: '7&8F@k#4sT9mDzA2%jPw@QnEiL5XoG1hV6rYcK3lSxZuNv0eBqIyM',
  }
};

async function validDp(image){
    const payload = {
        image: image
    }
    try {
        return await axios.post(URL.validDp, payload, config);
      } catch (error) {
        console.error(error);
        return {ok: false, e: error};
    }
}

async function faceMatch(actualImage, targetImage){
    const payload = {
        images: [actualImage, targetImage]
    }
    try {
        return await axios.post(URL.faceMatch, payload, config);
      } catch (error) {
        console.error(error);
        return {ok: false, e: error};
    }
}

async function toText(base64Audio){
    const payload = {
        audio: base64Audio
    }
    try {
        return await axios.post(URL.toText, payload, config);
      } 
      catch (error) {
        console.error(error);
        return {ok: false, e: error};
    }
};

async function matchText(actualText, targetText){
    const payload = {
        texts: [actualText, targetText]
    }
    try {
        return await axios.post(URL.textMatch, payload, config);
      } catch (error) {
        console.error(error);
        return {ok: false, e: error};
    }
}

module.exports = {
    toText,
    matchText,
    faceMatch,
    validDp
}