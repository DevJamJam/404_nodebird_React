const express = require('express');
const multer = require('multer'); //이미지 업로드를 위한 미들웨어
const path = require('path');
const fs = require('fs'); //파일시스템 조작

const {Post , Comment, Image, User} = require('../models');
const {isLoggedIn} = require('./middlewares');
const router = express.Router();

try {
    fs.accessSync('uploads'); // 있는지 검사하고 
} catch(error) {
    console.log('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); //없으면 생성
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,done) {
            done(null, 'uploads');
        },
        filename(req,file, done) { //사공사.png
            const ext = path.extname(file.originalname); //확장자 추출(.png)
            const basename = path.basename(file.originalname, ext) //사공사
            done(null, basename + '_'+ new Date().getTime() + ext) //파일이름 + 시간 + 확장자
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, //20MB
});

router.post('/', isLoggedIn, upload.none(), async (req,res,next)=>{  // await붙여주면 async 해주어야하고
    try { // try catch문으로 감싸 주어야 한다. 
        const post = await Post.create({ // await 붙여줘야한다.
            content: req.body.content,
            UserId: req.user.id,
        });
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
    res.json(req.files.map((v)=>v.filename));
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