export const meQuery = `
{
  me {
    _id
    name
    email
    picture
  }
}
`;

export const pinsQuery = `
  {
    pins {
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
          _id
          name
          picture
        }
      }
    }
  }
`;
