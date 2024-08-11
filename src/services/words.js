import axios from 'axios'
const baseUrl = 'http://localhost:3001/words/'

function getAll() {
    const request = axios.get(baseUrl)
    return request.then(r => r.data)
}

function create(word) {
    const request = axios.post(baseUrl, word)
    return request.then(r => r.data)
}

export default { getAll, create }