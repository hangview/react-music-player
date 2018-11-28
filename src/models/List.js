import { fetchList } from '../services/list';

export default {
  namespace: 'List',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchList, payload);
      yield put({
        type: 'fetchList',
        list: response,
      });
    },

  },
  reducers: {
    fetchList(state, action) {
      const musics = action.list.map((music, key) => Object.assign(music, { key: key + 1 }));
      console.log(musics);
      return {
        ...state,
        list: musics,
      };
    },
  },
};
