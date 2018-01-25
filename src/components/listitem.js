import React from 'react';

import styles from './listitem.less';

export default class ListItem extends React.PureComponent {

  constructor(){
    super();
  }

  render () {
    let item = this.props.data;

    return (
      <li className = {`row ${styles.componentListitem}  ${this.props.focus?styles.focus:''}  `}  onClick={() => this.props.clickItem(item.id)}>
        <p><span className="bold">{item.title}</span> - {item.artist}</p>
        <p className="-col-auto delete" />
      </li>

    )
  }
}
