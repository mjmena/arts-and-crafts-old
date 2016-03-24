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
        viewer
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
class App extends Component {
  render() {
    return (
      <div>
      {this.props.viewer.customers.map((customer) => (
        <div>
          <div>{customer.name}</div>
          <div>{customer.billing_address.day}</div>
        </div>
      ))}
      </div>
    );
  }
}

const AppContainer =  Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        customers{
          name
          billing_address{
            day
          }
        }
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