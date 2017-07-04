import React from 'react';

export default class Home extends React.Component {

  static async getInitialProps(props) {
    const { query } = props;
    const { token, refreshToken } = query;
    if (localStorage) {
      localStorage.setItem('token2', token);
      localStorage.setItem('refreshToken2', refreshToken);
    }

    return {
      query,
    };
  }

  // componentDidMount() {
  //   console.log("CLIENT SIDE");
  // }

  render() {
    return (<h1>home page</h1>);
  }

}