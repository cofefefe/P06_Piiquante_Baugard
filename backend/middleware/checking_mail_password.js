const regexEmail = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
// At least one maj, one number and 10 characters
const regexPassword = /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/

exports.clientEmailVerification= (email) => {
    console.log('regexemail :', regexEmail.test())
    return regexEmail.test(email)
}

exports.clientPasswordVerification = (password) => {
   return regexPassword.test(password)
}
