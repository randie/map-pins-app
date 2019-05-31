import gql from 'graphql-tag';

export const pinCreatedSubscription = gql`
  subscription {
    pinCreated {
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`;
