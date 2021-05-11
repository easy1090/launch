import axios from 'axios';

const requestFn = (url: string) => {
  return axios({
    method: 'get',
    url,
    responseType: 'json',
    timeout: 30000,
  })
}

export default requestFn;