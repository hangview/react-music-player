import React from 'react';
import styles from './progress.less';

let Progress = React.createClass({
  getDefaultProps() {
    return {
      barColor: '#2f9842'
    }
  },
  changeProgress(e) {
    let progressBar = this.refs.progressBar;
    let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
    this.props.onProgressChange && this.props.onProgressChange(progress);
  },
  render() {
    return (
      <div className={styles.componentProgress} ref="progressBar" onClick={this.changeProgress}>
        <div  style={{width: `${this.props.progress}%`, background: this.props.barColor}}></div>
      </div>
    );
  }
});

export default Progress;
