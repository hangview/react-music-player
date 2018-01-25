import {getItem} from '../services/play';

export default {
  namespace: 'Play',
  state: {
    currentItem:null,
  },
  effects: {
    *get({payload},{call,put}) {
      const response = yield call(getItem,payload);
      yield put({
        type:'getItem',
        item:response
      })
    }

  },
  reducers: {
    getItem(state,action) {
      return {
        ...state,
        currentItem:action.item
      }
    }
  }
};
