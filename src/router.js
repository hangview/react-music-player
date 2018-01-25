import React from 'react';
import { Router, Route, Switch,Redirect } from 'dva/router';

import App from "./routes/App.js";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
