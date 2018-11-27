import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import ListItem from '../components/listitem';

@connect(state => ({
  list: state.List.list,
}))

export default class List extends PureComponent {
  state = {
    currentItemId: this.props.currentItemId,
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'List/fetch',
    });
  }

  clickItem(itemId) {
    this.props.dispatch(routerRedux.push(`/play/${itemId}`));
  }

  render() {
    let items = null,
      lists = this.props.list;
    if (_.isArray(lists) && lists.length > 0) {
      items = lists.map(item =>
        <ListItem
          key={item.id} data={item}
          clickItem={id => this.clickItem(id)}
          focus={item.id == this.props.currentItemId}
        />,
        );
    }

    return (
      <div className="component-list" style={{ fontFamily: 'cursive' }}>
        {items}
      </div>
    );
  }
}

