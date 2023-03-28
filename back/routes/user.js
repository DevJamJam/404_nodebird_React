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

router.post('/logout', isLoggedIn ,(req,res,next)=> { //passport 버전에 따른 코드 수정 
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy();
        res.redirect('/');
    })
});

router.patch('/nickname', isLoggedIn, async(req,res,next)=> {
    try{
        //수정할땐 update
        User.update({ //첫번째 객체 : 무엇을 수정할지 , 두번째 객체 : 누구꺼? 
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id},
        }); // 내  Id 의 닉네임을 프론트에서 받은 닉네임으로 수정한다 ! 
        res.status(200).json({ nickname: req.body.nickname});
    } catch(error) {
        console.log(error);
        next(error);
    }
})

module.exports = router;