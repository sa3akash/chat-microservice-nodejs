import authPaths from './auth.json';
import usersPaths from './users.json';
import chatPaths from './chat.json';

const paths = {
  ...authPaths,
  ...usersPaths,
  ...chatPaths,
};

export default paths;
