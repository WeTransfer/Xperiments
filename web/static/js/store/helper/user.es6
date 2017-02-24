let avatar = null;
if (window['__user__'] && window['__user__'].id)
  avatar = `/images/avatars/${window['__user__'].id%12}.png`;

const user = Object.assign({}, {
  id: null,
  email: null,
  name: null,
  role: null,
  avatar: avatar,
  avatar_uri: null,
  selectedApplication: 2
}, window['__user__']);

export default user;