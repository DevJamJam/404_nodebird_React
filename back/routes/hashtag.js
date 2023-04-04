const express = require('express');
const { Op } = require('sequelize');

const { User, Hashtag, Comment, Image, Post } = require('../models');

const router = express.Router();

router.get('/:hashtag',async(req,res,next)=> { //GET /hashtag/사공사
    try{
        const where = {};
        if (parseInt(req.query.lastId, 10)) { //초기 로딩이 아닐때 
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
            //id가 lastId보다 작은것으로 10개를 불러오도록 
        } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
        const posts = await Post.findAll({
            //where: { id: lastId} , offset, limit 방식은 잘 안쓰고 lastId를 쓴다.  추후 구현 예정
            where,
            limit: 10, //10개만 가져오도록 limit
            order: [
                ['createdAt', 'DESC'], // 1차 게시글 생성일로부터 내림차순 정렬하고 
                [Comment, 'createdAt', 'DESC'] //2차 댓글들 생성일로부터 내림차순으로 정렬 
            ],  //2차원배열 : 여러기준으로 정렬할 수 있기 때문
            include: [{
                model: Hashtag,
                where: { name: decodeURIComponent(req.params.hashtag)},
            },{
                model: User, 
                attributes: ['id','nickname'],
            },{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id','nickname'],
                }],
            }, {
                model: User, //좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }, { 
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
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