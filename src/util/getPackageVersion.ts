import axios from 'axios';

const requestFn = (url: string, range: string) => {
  const registry = `https://registry.npm.taobao.org`; // TODO区分淘宝源与npm源
  return axios({
    method: 'get',
    url: `${registry}/${encodeURIComponent(url).replace(/^%40/, '@')}/${range}`,
    responseType: 'json',
    timeout: 30000,
  })
}

export default requestFn;