import request from '../utils/request';

export async function getItem(params) {
  return request(`/music/list/${params.id}`);
}
