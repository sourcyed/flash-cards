import axios from 'axios'
const baseUrl = '/api/words/'
// const assetsPath = './assets/images/'

let token = null

function setToken(newToken) {
  token = `Bearer ${newToken}`
}

async function getAll() {
    const config = {
      headers: { Authorization: token },
    }
    const request = axios.get(baseUrl, config)
    const r = await request
  return r.data
}

async function create(word) {
    const config = {
      headers: { Authorization: token },
    }
    const r = await axios.post(baseUrl, word, config)
    return r.data
}

async function update(word) {
    const config = {
      headers: { Authorization: token },
    }
    const request = axios.put(baseUrl + word.id, word)
    const r = await request
  return r.data
}

async function del(word) {
    const config = {
      headers: { Authorization: token },
    }
    const request = axios.delete(baseUrl + word.id)
    const r = await request
  return r.data
}

// function uploadImage(wordId, url) {
//     const response = axios.get(url, { responseType: 'stream'}).then(r => {

//     })
// }

export default { getAll, create, update, del, setToken }