import { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

export const GRAPHQL_ENDPOINT =
  process.env.NODE_ENV === 'production' ? 'TODO' : 'http://localhost:4000/graphql';

export const useGraphQLClient = () => {
  const [idToken, setIdToken] = useState('');

  // grab logged-in user's id token when component is mounted
  useEffect(() => {
    const token = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;
    setIdToken(token);
  }, []);

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: { authorization: idToken },
  });
};
