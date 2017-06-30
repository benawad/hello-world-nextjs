import { compose, gql, graphql } from "react-apollo";
import withData from "../apollo/withData";

const query = gql`
{
	allUsers {
    id
    username
  }
}
`;

const subscription = gql`
subscription {
  userAdded {
    id
    username
  }
}
`;

class Index extends React.Component {
  componentDidMount() {
    this.props.data.subscribeToMore({
      document: subscription,
      updateQuery: (prev, { subscriptionData }) => {
        /*
          prev = {
            anotherQuery: {}
            allUsers: [bob1, bob2, ...],
          }
        */
        if (!subscriptionData.data) {
          return prev;
        }
        const newUser = subscriptionData.data.userAdded;
        return {
          ...prev,
          allUsers: [newUser, ...prev.allUsers]
        };
      }
    });
  }

  render() {
    const { allUsers = [] } = this.props.data;
    return (
      <div>
        Welcome to next.js!
        <ul>
          {allUsers.map(u => <li key={u.id}>{u.username}</li>)}
        </ul>
      </div>
    );
  }
}

const GraphqlIndex = compose(graphql(subscription), graphql(query))(Index);

export default withData(GraphqlIndex);
