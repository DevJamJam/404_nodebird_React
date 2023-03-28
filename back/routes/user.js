const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async(req,res,next)=> { //GET /user
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: {id: req.user.id},
                attributes: {
                    exclude:['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch(error) {
        console.error(error);
        next(error);
    }
})

//POST /user/login
router.post('/login', isNotLoggedIn, (req,res,next)=> { //미들웨어 확장
    passport.authenticate('local', (err,user,info)=>{
        if (err) { //서버에러
            console.error(err);
            return next(err);
        }
        if (info) { // 클라이언트 에러 
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr)=> {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where: {id: user.id},
                attributes: {
                    exclude:['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                },{
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            return res.status(200).json(fullUserWithoutPassword); //로그인 통과 사용자 정보 => 프론트로 넘겨준다. 
        }); // 성공 , user엔 사용자 객체가 들어있다.
            
    })(req,res,next);
}); 



router.post('/', isNotLoggedIn ,async (req, res, next) => { //POST /user
    try {
        const exUser = await User.findOne({
            where: { //찾을때
                email: req.body.email,
            }
        });
        if (exUser) {
            return res.status(404).send('이미 사용중인 이메일 이에요');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        res.status(200).send('ok');
        // 200 성공 , 300 리다이렉트 , 400 클라이언트에러 500 서버에러 
    } catch (error) {
        console.log(error);
        next(error); //status 500
    }
});

router.post('/logout', isLoggedIn ,(req,res)=> {
    req.logout();
    req.session.destroy();
    res.status(200).send('ok');
});

module.exports = router;