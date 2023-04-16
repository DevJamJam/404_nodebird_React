const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express(); //한번 호출 해주어야 한다.
db.sequelize.sync()
    .then(()=> {
        console.log('db연결 성공');
    })
    .catch(console.error);
passportConfig();

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(cors({
        origin: 'http://gongsabird.site', //모든 출처 허용 옵션 , Access-Control-Allow-Origin 
        // 쿠키공유까지 허락 되었을 때는 true or '*'로 사용할 수 없다. 민감한 정보보내니 정확한 주소 줘야한다..! 
        credentials: true,  //다른 도메인 간에 쿠키 공유를 허락하는 옵션 ,Access-Control-Allow-Credentials
    })); // CORS해결 
} else {
    app.use(morgan('dev'));
    app.use(cors({
        origin: 'http://localhost:3025', //모든 출처 허용 옵션 , Access-Control-Allow-Origin 
        // 쿠키공유까지 허락 되었을 때는 true or '*'로 사용할 수 없다. 민감한 정보보내니 정확한 주소 줘야한다..! 
        credentials: true,  //다른 도메인 간에 쿠키 공유를 허락하는 옵션 ,Access-Control-Allow-Credentials
    })); // CORS해결 
}
app.use('/',express.static(path.join(__dirname, 'uploads'))); 
app.use(express.json()); // json data넘어 올때 처리
app.use(express.urlencoded({ extended: true })); //form submit해서 넘어올때 처리
//Front에 들어온 데이터를 해석해서 req.body안에 넣어준다. 

//cookie와 session을 위한 설정 
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        domain: process.env.NODE_ENV === 'production' && '.gongsabird.site'
    }
}));
app.use(passport.initialize());
app.use(passport.session());


/*
    app.get => 가져오다
    app.post => 생성하다
    app.put => 전체 수정
    app.delete => 제거
    app.patch => 부분수정
    app.options => 찔러보기
    app.head => 헤더만 가져오기 (헤더/바디)
*/
app.get('/',(req,res)=>{ // '/' url , get 메서드
    res.send('안녕! express');
})

app.use('/user',userRouter);
app.use('/post',postRouter);
app.use('/posts',postsRouter);
app.use('/hashtag', hashtagRouter);



app.listen(3065, () => {
    console.log('서버 실행 중 입니댜');
})