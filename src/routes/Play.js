import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { routerRedux } from 'dva/router';
import $ from 'jquery';
import { random } from '../utils/function';
import './play.less';
import Progress from '../components/progress';

let duration = 0;
const REPEAT_CYCLE = 'cycle';
const REPEAT_ONCE = 'once';
const REPEAT_RANDOM = 'random';

@connect(state => ({
  currentItem: state.Play.currentItem,
  lists: state.List.list,
}))

export default class Play extends PureComponent {

  state = {
    progress: 0,
    volume: 20,
    isPlay: true,
    leftTime: '',
    repeatType: REPEAT_CYCLE,
    item: null,
  };

  getItem(id = this.props.match.params.id) {
    this.props.dispatch({
      type: 'Play/get',
      payload: {
        id,
      },
    });
  }

  componentDidMount() {
    this.getItem();
    if (!this.props.lists.length > 0) {
      this.props.dispatch({
        type: 'List/fetch',
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.id != this.props.match.params.id) {
      this.getItem(newProps.match.params.id);
    }

    if (newProps.currentItem && (!this.props.currentItem || newProps.currentItem.id != this.props.currentItem.id)) {
      this.initPlay(newProps.currentItem);
    }
  }

  componentDidUpdate(preProps) {
    // 重复点击同一首歌
    if (!this.refs.zone && this.props.currentItem) {
      this.initPlay(this.props.currentItem);
    }
  }

  componentWillUnmount() {
    $('#player')
      .unbind($.jPlayer.event.timeupdate);
    $('#player')
      .unbind($.jPlayer.event.ended);
    duration = 0;
  }

  initPlay(item) {
    this.setState({
      currentItem: item,
      isPlay: true,
    });
    this.props.playMusic(item);
    $('#player')
      .bind($.jPlayer.event.timeupdate, (e) => {
        duration = e.jPlayer.status.duration;     // 歌曲总时间
        this.setState({
          progress: e.jPlayer.status.currentPercentAbsolute,
          volume: e.jPlayer.options.volume * 100,
          leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100)),
        });
      });

    $('#player')
      .bind($.jPlayer.event.ended, (e) => {
        const repeatType = this.state.repeatType;
        if (repeatType == REPEAT_CYCLE) {
          this.next();
        } else if (repeatType == REPEAT_ONCE) {
          this.props.playMusic(this.state.currentItem);
        } else if (repeatType == REPEAT_RANDOM) {
          this.changeItem(random(1, this.props.lists.length));
        }
      });
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}: ${seconds}`;
  }

  changeItem(key) {
    const id = this.props.lists[key-1].id;
    this.props.dispatch(routerRedux.replace(`/play/${id}`));
  }

  prev() {
    let id = this.props.currentItem.id;
    const num = id <= 2 ? this.props.lists.length : --id;
    this.changeItem(num);
  }

  next() {
    const id = this.props.currentItem.id;
    const key = this.props.lists.filter(music => music.id === id)[0].key;
    let num = key >= this.props.lists.length ? 1 : key + 1;
    const repeatType = this.state.repeatType;
    if (repeatType === REPEAT_RANDOM) {
      num = random(1, this.props.lists.length);
    }
    if (repeatType === REPEAT_ONCE) {
      return this.props.playMusic(this.state.currentItem);
    }
    this.changeItem(num);
  }

  pause() {
    if (this.state.isPlay) {
      $('#player')
        .jPlayer('pause');
    } else {
      $('#player')
        .jPlayer('play');
    }
    this.setState({
      isPlay: !this.state.isPlay,
    });
  }

  playType() {
    let type = '';
    if (this.state.repeatType == 'cycle') {
      type = 'once';
    }
    if (this.state.repeatType == 'once') {
      type = 'random';
    }
    if (this.state.repeatType == 'random') {
      type = 'cycle';
    }
    this.setState({
      repeatType: type,
    });
  }

  changeMusicProgress(percent) {
    $('#player')
      .jPlayer('play', duration * percent);
  }

  changeVolumeProgress(percent) {
    $('#player')
      .jPlayer('volume', percent);
  }

  render() {
    const item = this.state.currentItem;

    const btnStyle = {
      cursor: 'pointer',
    };

    return (
      <div className="playerPage">
        <h1><Link to="/list">我的音乐</Link></h1>
        {item ?
          <div ref="zone" className="mt20 row">
            <div className="controll-wrapper">
              <h2 className="musicTitle">{item.title}</h2>
              <h3 className="musicArtist mt10">{item.artist}</h3>
              <div className="row mt20">
                <div className="leftTime -col-auto">-{this.state.leftTime}</div>
                <div className="volumeContainer">
                  <i className="icon-volume rt" style={{ top: 5, left: -5 }} />
                  <div className="volumeWrapper">
                    <Progress
                      progress={this.state.volume} barColor="#aaa"
                      onProgressChange={this.changeVolumeProgress}
                    />
                  </div>
                </div>
              </div>
              <div style={{ height: 10, lineHeight: '10px', marginTop: '8px' }}>
                <Progress
                  progress={this.state.progress}
                  onProgressChange={this.changeMusicProgress}
                />
              </div>
              <div className="row" style={{ marginTop: '35px' }}>
                <div>
                  <i
                    className="icon prev" style={btnStyle}
                    onClick={() => this.prev()}
                  />
                  <i
                    className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`}
                    style={btnStyle}
                    onClick={() => this.pause()}
                  />
                  <i className="icon next ml20" style={btnStyle} onClick={() => this.next()} />
                </div>
                <div className="-col-auto">
                  <i
                    className={`icon repeat-${this.state.repeatType}`}
                    onClick={() => this.playType()}
                  />
                </div>
              </div>
            </div>

            <div className={'-col-auto cover'}>
              <img className="musicImg" src={item.cover} alt={item.title} />
            </div>
          </div>
          : ''}
      </div>
    );
  }
}

