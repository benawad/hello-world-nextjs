import Head from 'next/head'
import { gql, graphql } from "react-apollo";

import withData from "../apollo/withData";

const auth = ({ data }) => (
  <div>
    <Head>
      <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/antd/2.9.3/antd.min.css' />
    </Head>
  </div>
);

const query = gql`
{
  allUsers {
		id
    username
  }
}`;

export default withData(graphql(query)(auth));
