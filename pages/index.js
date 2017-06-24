import { gql, graphql } from "react-apollo";
import withData from "../apollo/withData";

const query = gql`
{
	allUsers {
    id
    username
  }
}
`;

const index = ({ data: { allUsers } }) => (
  <div>
    Welcome to next.js!
    <ul>
      {allUsers.map(u => <li key={u.id}>{u.username}</li>)}
    </ul>
  </div>
);

const GraphqlIndex = graphql(query)(index);

export default withData(GraphqlIndex);
