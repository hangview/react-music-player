import {PureComponent} from 'react';
import './logo.less';

export default class Logo extends PureComponent {
  render(){
      return (
        <div className='componentsLogo row'>
          <img src="../assets/logo.png" width='40' alt="" className="-col-auto"/>
          <h1><a href="#/list">Music Player</a></h1>
        </div>
      )
  }
}
