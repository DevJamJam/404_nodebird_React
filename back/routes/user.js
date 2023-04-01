const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async(req,res,next)=> { //GET /user
    console.log(req.headers);
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
});

router.get('/:userId', async(req,res,next)=> { //GET /user/id
    console.log(req.params.userId);
    try {
        const fullUserWithoutPassword = await User.findOne({
            where: { id: req.params.userId },
            attributes: {
                exclude: ['password']
            },
            include: [{
                model: Post,
                attributes: ['id'],
            }, {
                model: User,
                as: 'Followings',
                attributes: ['id'],
            }, {
                model: User,
                as: 'Followers',
                attributes: ['id'],
            }]
        })
        if (fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();
            data.Posts = data.Posts.length; //개인정보 침해 예방 차원 
            data.Followings = data.Followings.length;
            data.Followers = data.Followers.length;
            res.status(200).json(data);
        } else {
            res.status(404).json('존재하지 않는 사용자입니다.');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

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

router.patch('/nickname', isLoggedIn, async(req,res,next)=> { //PATCH /user/nickname
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
});

router.patch('/:userId/follow', isLoggedIn, async(req,res,next)=> { //PATCH /user/1/follow
    try{
        const user = await User.findOne({ where: {id : req.params.userId }});
        if (!user) {
            return res.status(403).send('어딜 팔로우 하시려는거죠? 그것은 제 잔상입니다만 ..?');
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({UserId: parseInt(req.params.userId)});
    } catch(error) {
        console.log(error);
        next(error);
    }
});
router.delete('/:userId/follow', isLoggedIn, async(req,res,next)=> { //DELETE /user/1/follow
    try{
        const user = await User.findOne({ where: {id : req.params.userId }});
        if (!user) {
            return res.status(403).send('누굴 언팔로우 하시려는거죠? 그것은 제 잔상입니다만 ..?');
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId) });
    } catch(error) {
        console.log(error);
        next(error);
    }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => { // DELETE /user/follower/1
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            res.status(403).send('누굴 차단하려고 하시는거죠? 아무도 없습니다만 ?');
        }
        await user.removeFollowings(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/followers', isLoggedIn, async(req,res,next)=> { //GET /user/followers
    try{
        const user = await User.findOne({ where: {id : req.user.id }});
        if (!user) {
            return res.status(403).send('아무도 없는데 누굴 찾으시려고요 ..? ');
        }
        const followers = await user.getFollowers();
        res.status(200).json(followers)
    } catch(error) {
        console.log(error);
        next(error);
    }
});

router.get('/followings', isLoggedIn, async(req,res,next)=> { //GET /user/followings
    try{
        const user = await User.findOne({ where: {id : req.user.id }});
        if (!user) {
            return res.status(403).send('아무도 없는데 누굴 찾으시려고요 ..? ');
        }
        const followings = await user.getFollowings();
        res.status(200).json(followings)
    } catch(error) {
        console.log(error);
        next(error);
    }
});


module.exports = router;