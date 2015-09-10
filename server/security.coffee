methodsSecurity =
  root:
    authNotRequired: true
    roles: "all"
  createUser:
    roles: "sysadmin"
  reg:
    authNotRequired: true
    roles: "all"
  checkLogin:
    authNotRequired: true
    roles: "all"
  login:
    authNotRequired: true
    roles: "all"
  logout:
    authNotRequired: true
    roles: "all"
  forgotPassword:
    authNotRequired: true
    roles: "all"
  resetPassword:
    authNotRequired: true
    roles: "all"
  updatePass:
    authNotRequired: true
    roles: "all"
  fakePartners:
    roles: "sysadmin"
  impersonate:
    roles: "sysadmin"
  insertInvite:
    roles: "partner"
  networkCounts:
    roles: "partner"
  invalidateQr:
    authNotRequired: true
    roles: "all"
  checkQr:
    authNotRequired: true
    roles: "all"
  updateProfile:
    roles: "partner,sysadmin"

Meteor.beforeAllMethods ()->
  methodName = this._methodName
  authLog.info "before call method: " + methodName
  unless Meteor.userId()
    unless methodsSecurity[methodName].authNotRequired
      authLog.warn "authorization required"
      throw new Meteor.Error(403, 'Not authorized')
  else
    roles = methodsSecurity[methodName].roles
    authLog.info "required roles: " + roles
    unless roles == 'all'
      if roles.match /,/
        roles = roles.split ','
      unless Roles.userIsInRole(Meteor.userId(), roles)
        authLog.warn "required roles check failed"
        throw new Meteor.Error(403, 'No access')
      else
        authLog.info "required roles check success"

Impersonate.admins = ["sysadmin", "support"];