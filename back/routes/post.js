const express = require('express');

const {Post , Comment, Image, User} = require('../models');
const {isLoggedIn} = require('./middlewares');
const router = express.Router();

router.post('/', isLoggedIn, async (req,res,next)=>{  // await붙여주면 async 해주어야하고
    try { // try catch문으로 감싸 주어야 한다. 
        const post = await Post.create({ // await 붙여줘야한다.
            content: req.body.content,
            UserId: req.user.id,
        })
        const fullPost = await Post.findOne({
            where: {id: post.id},
            include: [{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id','nickname'],
                }]
            },{
                model: User,
                attributes: ['id','nickname']
            }]
        })
        res.status(201).json(fullPost);
    } catch(error) {
        console.error(error);
        next(error);
    }
})
router.post('/:postId/comment', isLoggedIn, async(req,res,next)=> { //주소 부분에서 동적으로 바뀌는 부분 파라미터
    try{
        const post = await Post.findOne({
            where: {id: req.params.postId}
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글 입니다 !!');
            // return을 붙여줘야 하단의 res가 실행 되지 않는다.
            // 요청한번에 응답한번 지켜야함.. 
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId,10), //문자열로 넘어와서 에러발생 ..parseInt 해준다.
            UserId: req.user.id,
        })
        const fullComment = await Comment.findOne({
            where: {id: comment.id},
            include: [{
                model:User,
                attributes: ['id','nickname'],
            }]
        })
        res.status(201).json(fullComment);

    } catch(error){
        console.error(error);
        next(error);
    }
})

router.delete('/',(req,res)=>{
    res.json([{id:3, content: 'vervon'}]);
})


module.exports = router;