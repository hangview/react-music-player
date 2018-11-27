import request from '../utils/request';

export async function fetchList() {
  return request('/music/all');
}
