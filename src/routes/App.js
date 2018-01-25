import React from 'react';
import { Link, Route, Redirect, Switch } from 'dva/router';
import $ from 'jquery';
require('jquery');
require('jplayer');

import Logo from '../components/logo';
import List from './List';
import Play from './Play';


export default class App extends  React.PureComponent {

  state = {
    currentItemId:null,
  }

  componentDidMount(){
    // init player
    $("#player").jPlayer({
      supplied: "mp3",
      wmode: "window",
      useStateClassSkin: true
    });
  }

  //播放音乐放在最外层保证音乐不停
  playMusic(item){
    this.setState({
      currentItemId:item.id
    })
    $("#player").jPlayer('setMedia', {
      mp3: item.file
    }).jPlayer('play')
  }


  render(){

    return (
      <div className="component-list">
        <Logo />
        <Switch>
          <Route  exact path="/list"
                  render={(props)=><List {...props}  currentItemId={this.state.currentItemId}  />} />
          <Route  exact path="/play/:id"
                  render={(props)=><Play {...props}  playMusic={(item)=> this.playMusic(item)}  />} />
          <Redirect to="/list" />
        </Switch>
      </div>
    )
  }
}



