import React, {
  Component
}
from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class App extends Component {
  render() {
    let customers = this.props.viewer.customers.map(customer => {
      return (
        <div>
          <div>{customer.name}</div>
          <div>{customer.billing_address.city}</div>
        </div>
      )
    });
    
    return (
      <div>
        {customers}
      </div>
    );
  }
}

class AppHomeRoute extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL `
      query {
        viewer
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}

const AppContainer = Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL `
      fragment on Viewer {
        customers{
          id
          name
          billing_address{
            id
            city
          }
          service_addresses(first:2){
            edges{
              node{
                description
                city
              }
            }
          }
        }
      }`
  },
});

ReactDOM.render(
  <Relay.RootContainer
    Component={AppContainer}
    route={new AppHomeRoute()}
  />,
  document.getElementById('root')
);
