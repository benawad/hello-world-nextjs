import React from 'react';
import Head from 'next/head'
import { Input } from 'antd';
import { Checkbox } from 'antd';
import { Button } from 'antd';
import { gql, graphql } from "react-apollo";

import withData from "../apollo/withData";

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    isAdmin: false,
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value === undefined ? e.target.checked : e.target.value,
    });
  }

  onSubmit = () => {
    this.props.mutate({
      variables: this.state,
    })
  }

  render() {
    return (
      <div>
        <Head>
          <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/antd/2.9.3/antd.min.css' />
        </Head>
        <Input
          name='username'
          placeholder='Username'
          value={this.state.username}
          onChange={e => this.onChange(e)} />
        <br />
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
        <Checkbox
          name='isAdmin'
          checked={this.state.isAdmin}
          onChange={e => this.onChange(e)}>
          Admin?
        </Checkbox>
        <br />
        <Button onClick={() => this.onSubmit()} type='primary'>Submit</Button>
      </div>
    );
  }
}

const registerMutation = gql`
mutation($username: String!, $email: String!, $password: String!, $isAdmin: Boolean) {
  register(username: $username, email: $email, password: $password, isAdmin: $isAdmin) {
    id
  }
}
`;

const GraphQLRegister = graphql(registerMutation)(Register);

export default withData(GraphQLRegister);
