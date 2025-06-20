import axios from 'axios'
const baseUrl = '/api/words/'
// const assetsPath = './assets/images/'

let token = null

function setToken(newToken) {
  token = `Bearer $`
}

function getAll() {
    const request = axios.get(baseUrl)
    return request.then(r => r.data)
}

async function create(word) {
  const config = {
    headers: { Authorization: token },
  }
    const response = await axios.post(baseUrl, word, config)
    return response.data
}

function update(word) {
    const request = axios.put(baseUrl + word.id, word)
    return request.then(r => r.data)
}

function del(word) {
    const request = axios.delete(baseUrl + word.id)
    return request.then(r => r.data)
}

// function uploadImage(wordId, url) {
//     const response = axios.get(url, { responseType: 'stream'}).then(r => {

//     })
// }

export default { getAll, create, update, del, setToken }