import express from 'express'
import userCtrl from '../controllers/user.controller'
import authController from '../controllers/auth.controller';

const router = express.Router()
router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create)
router.route('/api/users/:userId')
    .get(
        authController.authhenticateToken,
        userCtrl.read)
    .put(userCtrl.update)
    .delete(userCtrl.remove)
router.param('userId', userCtrl.userByID)
export default router