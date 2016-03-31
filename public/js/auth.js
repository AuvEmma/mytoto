const $ = require('jquery');

module.exports = {
  login(email, password, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    loginRequest(email, password, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token
        if (cb) cb(true)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  getToken() {
    return localStorage.token
  },

  logout(cb) {
    delete localStorage.token
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn() {
    return !!localStorage.token
  },

  onChange() {}
}

function loginRequest(email, password, cb) {

  var loginCreds = {
    email: email,
    password: password
  }

  $.post('guests/login', loginCreds)
    .done((data) => {
      console.log(data);
      cb({
        authenticated: true,
        token: data.token
      })
    })
    .error((error) => {
      console.log(error);
      cb({
        authenticated: false

      })
    })
}
