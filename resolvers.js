const user = {
  _id: '1',
  name: 'Randie',
  email: 'randie@zombo.com',
  picture: 'https//cloudinary.com/randie.jpg',
};
const resolvers = {
  Query: {
    me: () => user,
  },
};

export default resolvers;
