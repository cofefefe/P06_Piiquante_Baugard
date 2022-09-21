const regexEmail = '^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$'
// At least one maj, one number and 10 characters
const regexPassword = '^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$'

exports.clientEmailVerification= (req,res,next) => {
    if (regexEmail.test(req.body.email) === false) {
        return false;
    } 
    return true;
}

exports.clientPasswordVerification = (req,res,next) => {
    if(regexPassword.test(req.body.password) === false ){
        return false
    }
    return true
}
