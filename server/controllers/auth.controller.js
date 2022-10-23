import User from '../models/user.model'
import JsonWebToken from 'jsonwebtoken'
import expressJwt from "express-jwt";

import config from '../../config/config'

const signin = async (req, res) => {
    try {
        let user = await User.findOne({ "email": req.body.email })
        if (!user)
            return res.status('401').json({ error: "User not found" })
        if (!user.authenticate(req.body.password)) {
            return res.status('401').send({
                error: "Email and password don't match."
            })
        }
        const token = JsonWebToken.sign({ _id: user._id }, config.jwtSecret)
        res.cookie('t', token, { expire: new Date() + 9999 })
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        return res.status('401').json({ error: "Could not sign in" })
    }
}

const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}

// var { expressjwt: jwt } = require("express-jwt");

// const requireSignin = (req, res, next) => {
//     // var { expressjwt: jwt } = require("express-jwt");
//     // expressJwt({
//     //     secret: config.jwtSecret,
//     //     userProperty: 'auth'
//     // })
//     // next()

//     expressJwt
// }

// const requireSignin = expressJwt({
//     secret: config.jwtSecret,
//     userProperty: 'auth'
// })


const authhenticateToken = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)


    JsonWebToken.verify(token, config.jwtSecret, (err, user) => {
        console.log(err)
        if (err) return res.status('403').json({
            error: "User is not authorized"
        })

        req.user = user

        next()
    })
}
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if (!(authorized)) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default { signin, signout, hasAuthorization, authhenticateToken }