import axios from 'axios'
const baseUrl = 'http://localhost:3001/words/'
const assetsPath = './assets/images/'

function getAll() {
    const request = axios.get(baseUrl)
    return request.then(r => r.data)
}

function create(word) {
    const request = axios.post(baseUrl, word)
    return request.then(r => r.data)
}

function update(word) {
    const request = axios.put(baseUrl + word.id, word)
    return request.then(r => r.data)
}

// function uploadImage(wordId, url) {
//     const response = axios.get(url, { responseType: 'stream'}).then(r => {
        
//     })
// }

export default { getAll, create, update }