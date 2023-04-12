const express = require('express');
const multer = require('multer'); //이미지 업로드를 위한 미들웨어
const path = require('path');
const fs = require('fs'); //파일시스템 조작
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const {Post , Comment, Image, User, Hashtag} = require('../models');
const {isLoggedIn} = require('./middlewares');
const router = express.Router();

try {
    fs.accessSync('uploads'); // 있는지 검사하고 
} catch(error) {
    console.log('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); //없으면 생성
}

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
})
const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'gongsabird',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, //20MB
});

router.post('/', isLoggedIn, upload.none(), async (req,res,next)=>{  // await붙여주면 async 해주어야하고
    try { // try catch문으로 감싸 주어야 한다. 
        const hashtags = req.body.content.match(/#[^\s#]+/g); //정규표현식에 일치하는 것만 추출해준다.
        const post = await Post.create({ // await 붙여줘야한다.
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtags) {
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
                //없을때는 등록 있을땐 가져온다 findorCreate
                where: { name: tag.slice(1).toLowerCase() },
            }))); // [[노드, true], [리액트, true]]
            await post.addHashtags(result.map((v) => v[0]));
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) { //이미지를 여러개 올린경우 image: [콕잼.jpg,공사.jpg]
                const images = await Promise.all(req.body.image.map((image)=> Image.create({src: image})));
                await post.addImages(images);
            } else { //이미지를 하나만 올리면 image: 콕잼.jpg
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }
        const fullPost = await Post.findOne({
            where: {id: post.id},
            include: [{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User, //댓글 작성자
                    attributes: ['id','nickname'],
                }]
            },{
                model: User, // 게시글 작성자 
                attributes: ['id','nickname']
            },{
                model: User, //좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }]
        })
        res.status(201).json(fullPost);
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.post('/images', isLoggedIn, upload.array('image'), async(req,res,next)=> {
    //이미지 업로드 후 실행되는구간 
    console.log(req.files);
    res.json(req.files.map((v)=>v.location));
});

router.get('/:postId', async(req,res,next)=> { //주소 부분에서 동적으로 바뀌는 부분 파라미터
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(404).send('존재하지 않는 게시글입니다.');
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{ //어떤 게시글을 리트윗 한건지 ! 
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id', 'nickname'],
            },{
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }],
        })
        res.status(200).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

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
});

router.post('/:postId/retweet', isLoggedIn, async(req,res,next)=> { //주소 부분에서 동적으로 바뀌는 부분 파라미터
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
                model: Post,
                as: 'Retweet',
            }],
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            // 내가 쓴 글은 리트윗 x , 내가 쓴 글을 다른사람이 리트윗한 것을 다시 내가 리트윗 하는것 x
            return res.status(403).send('본인이 쓴 글을 본인이 Retweet 할 수 없습니다.');
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });
        if (exPost) {
            // 두번 리트윗 막아준다.
            return res.status(403).send('이미 리트윗 하셨습니다.');
        }
        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet', 
        });
        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [{ //어떤 게시글을 리트윗 한건지 ! 
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            },{
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }],
        })
        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:postId/like', isLoggedIn, async(req,res,next)=> { //PATCH  /post/1/like like
    try {
        const post = await Post.findOne({ where: {id: req.params.postId }});
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글 입니다');
        }
        await post.addLikers(req.user.id);
        res.json({ PostId: post.id , UserId: req.user.id});
    } catch(error){
        console.error(error);
        next(error);
    }
});

router.delete('/:postId/like', isLoggedIn ,async(req,res,next)=> { //DELETE /post/1/like unlike
    try {
        const post = await Post.findOne({ where: {id: req.params.postId }});
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글 입니다');
        }
        await post.removeLikers(req.user.id);
        res.json({ PostId: post.id , UserId: req.user.id});
    } catch(error){
        console.error(error);
        next(error);
    }
});

router.patch('/:postId', isLoggedIn ,async(req,res,next)=>{
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    try {
        await Post.update({
            content: req.body.content
        },{ 
            where: {
                id: req.params.postId,
                UserId: req.user.id,
            },
        });
        const post = await Post.findOne({where: {id: parseInt(req.params.postId, 10)}});
        if (hashtags) {
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
                //없을때는 등록 있을땐 가져온다 findorCreate
                where: { name: tag.slice(1).toLowerCase() },
            }))); // [[노드, true], [리액트, true]]
            await post.setHashtags(result.map((v) => v[0]));
        }
        res.status(200).json({PostId: parseInt(req.params.postId, 10), content: req.body.content}); //params 값은 문자열 ..숫자로 변환
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:postId', isLoggedIn ,async(req,res,next)=>{
    try {
        await Post.destroy({ //삭제할땐 destroy 
            where: {
                id: req.params.postId,
                UserId: req.user.id,
            },
        });
        res.status(200).json({PostId: parseInt(req.params.postId,10)}); //params 값은 문자열 ..숫자로 변환
    } catch(error) {
        console.error(error);
        next(error);
    }
});



module.exports = router;