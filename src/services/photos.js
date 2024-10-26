import axios from 'axios'
const baseUrl = 'api/photos/'

// function getPhotoWord(wordId) {
//     const request = axios.get(baseUrl + wordId)
//     return request.then(r => r.data)
// }

function replacePhoto(wordId) {
    const request = axios.get(baseUrl + wordId)
    return request.then(r => r.data)
}

export default { replacePhoto }