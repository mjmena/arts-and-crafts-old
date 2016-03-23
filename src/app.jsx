import 'babel-polyfill';

import React, {
  Component
} from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class AppHomeRoute extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL`
      query {
        customer (id:"Q3VzdG9tZXI6NTZmMTg1MzlmOTQ1YTA2YjBkMDBjYzFl")
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
class App extends Component {
  render() {
    return (
      <div>
        <div>{this.props.name}</div>
      </div>
    );
  }
}

const AppContainer =  Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Customer {
        name
      }
    `,
  },
});

ReactDOM.render(
  <Relay.RootContainer
    Component={AppContainer}
    route={new AppHomeRoute()}
  />,
  document.getElementById('root')
);