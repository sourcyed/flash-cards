import axios from 'axios'
const baseUrl = 'api/photos/'

function getPhoto(wordId) {
    const request = axios.get(baseUrl + wordId)
    return request.then(r => r.data)
}

export default { getPhoto }