const ROOT_URL = "https://mighty-oasis-08080.herokuapp.com/api/";

const articlesURL = ROOT_URL + "articles";

const registerURL = ROOT_URL + "users";

const updateUserURL = ROOT_URL + "user";

const userVerifyURL = ROOT_URL + "user"; //to see

const LoginURL = ROOT_URL + "users/login";

const tagsURL = ROOT_URL + "tags";

const composeURL = ROOT_URL + "articles";

const profileURL = ROOT_URL + "profiles";
const localStorageKey = "app_user";
export {
  ROOT_URL,
  articlesURL,
  updateUserURL,
  profileURL,
  composeURL,
  userVerifyURL,
  tagsURL,
  LoginURL,
  registerURL,
  localStorageKey,
};