import Router from 'express';
import {registerUser, loginUser, logoutUser} from '../controllers/user.controllers.js';
const router = Router()

router.route('/register').post(registerUser);


export default router;