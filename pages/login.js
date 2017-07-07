import React from 'react';
import Head from 'next/head'
import { Input } from 'antd';
import { Button } from 'antd';
import { gql, graphql } from "react-apollo";

import withData from "../apollo/withData";

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onSubmit = async () => {
    const response = await this.props.mutate({
      variables: this.state,
    });
    const { token, refreshToken } = response.data.login;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  render() {
    return (
      <div>
        <Head>
          <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/antd/2.9.3/antd.min.css' />
        </Head>
        <Input
          name='email'
          placeholder='Email'
          value={this.state.email}
          onChange={e => this.onChange(e)} />
        <br />
        <Input
          name='password'
          placeholder='Password'
          type='password'
          value={this.state.password}
          onChange={e => this.onChange(e)} />
        <br />
        <Button onClick={() => this.onSubmit()} type='primary'>Submit</Button>
      </div>
    );
  }
}

const loginMutation = gql`
mutation ($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    refreshToken
  }
}
`;

const GraphQLLogin = graphql(loginMutation)(Login);

export default withData(GraphQLLogin);
