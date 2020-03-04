function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''
  if(!authToken.toLowerCase().startsWith('basic')){
    return res
    .status(401)
    .json({error:"missing basic token"})
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length)
  }

  const [tokenUserName, tokenPassword ] = Buffer
  .from(basicToken, 'base64')
  .toString()
  .split(':')

  if(!tokenUserName || !tokenPassword){
    return res
    .status(401)
    .json({ error: 'Unauthorized request 1' })
  }

  req.app.get('db')('thingful_users')
    .where({user_name:tokenUserName})
    .first()
    .then(user =>{
      console.log("User: ",user)
      if (!user || user.password !== tokenPassword){
        return res
        .status(401)
        .json({error:'Unauthorized request 2'})
      }
      req.user = user
      next()
    })
    .catch(next)
}

module.exports = {
  requireAuth,
}