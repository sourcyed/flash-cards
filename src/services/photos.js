import axios from 'axios'
const baseUrl = 'api/photos/'

function getPhoto(query) {
    const request = axios.get(baseUrl + query)
    return request.then(r => r.data)
}

export default { getPhoto }