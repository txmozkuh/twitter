import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import User, { UserType } from '@/models/schemas/user.schema'
import { env } from './env'
import databaseService from '@/services/database.services'
import userService from '@/services/users.services'
import { RegisterRequest } from '@/types/request'
import { LoginFrom, UserVerifyStatus } from '@/constants/enums'

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/users/google/callback'
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await (
          await databaseService.getCollection(env.USERS_COLLECTION)
        ).findOne({ email: profile.emails![0].value })
        if (user) {
          return done(null, user)
        } else {
          const { name, picture, email } = profile._json
          const newUser = new User({
            name: name!,
            avatar: picture,
            email: email!,
            password: '123',
            date_of_birth: new Date()
          })
          await userService.register(newUser as RegisterRequest, LoginFrom.GoogleLogin)
          return done(null, newUser)
        }
      } catch (error) {
        return done(error, undefined)
      }
    }
  )
)

export default passport
