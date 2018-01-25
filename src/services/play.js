import request from '../utils/request';

export async function getItem(params) {
  return request(`/api/list/${params.id}`)
}
