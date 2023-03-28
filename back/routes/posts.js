const express = require('express');

const {Post, User, Image, Comment} = require('../models');


const router = express.Router();

router.get('/',async(req,res,next)=> {
    try{
        const posts = await Post.findAll({
            //where: { id: lastId} , offset, limit 방식은 잘 안쓰고 lastId를 쓴다.  추후 구현 예정
            limit: 10, //10개만 가져오도록 limit
            order: [
                ['createdAt', 'DESC'], // 1차 게시글 생성일로부터 내림차순 정렬하고 
                [Comment, 'createdAt', 'DESC'] //2차 댓글들 생성일로부터 내림차순으로 정렬 
            ],  //2차원배열 : 여러기준으로 정렬할 수 있기 때문
            include: [{
                model: User, 
                attributes: ['id','nickname'],
            },{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id','nickname'],
                }]
            }],
        });
        res.status(200).json(posts);
    } catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;