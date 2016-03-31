const React = require('react');
const auth = require('../auth');
const $     = require('jquery');

const Signup = React.createClass({

handleSubmit : function(event) {
    event.preventDefault()
    const email = this.refs.email.value
    const password  = this.refs.password.value

    const signupInfo = {
      email: email,
      password: password
    }
    if(password === this.refs.confirmPassword.value){
      $.post('/guests', signupInfo)
      .done((data) => {
        console.log(data);
        if(data) {
          alert('Signup Error, Email Already Exists!')
        }else {
        }
      })
      .error((error) => {
        console.error(error);
      })
    }else{
      alert('password does not match confirmPassword')
    }
  },

  render : function() {
    return (
      <div>
        <div id="signupform" style={{width: '30%', margin: 'auto', marginTop: '10px'}}>
          <aside>
            <form ref="formSignup" onSubmit={this.handleSubmit}>
              <h2>Please sign up</h2>
              <label htmlFor="inputEmail" >Email address</label>
              <input ref="email" type="email" id="inputEmail" placeholder="Email address" autofocus />

              <label htmlFor="inputPassword">Password</label>
              <input ref="password"  type="password" id="inputPassword" placeholder="Password" />

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input ref="confirmPassword"  type="password" id="inputPassword" placeholder="Password" />

              <button type="submit">Submit</button>
            </form>
          </aside>
        </div>
      </div>
    )
  }
});

module.exports = Signup;
