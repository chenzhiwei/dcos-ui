let EventTypes = {};
[
  'ACL_AUTH_USER_LOGIN_SUCCESS',
  'ACL_AUTH_USER_LOGIN_ERROR',
  'ACL_AUTH_USER_LOGOUT_SUCCESS',
  'ACL_AUTH_USER_LOGOUT_ERROR',
  'ACL_AUTH_USER_ROLE_CHANGED'
].forEach(function (eventType) {
  EventTypes[eventType] = eventType;
});

module.exports = EventTypes;