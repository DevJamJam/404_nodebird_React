const express = require('express');
const postRouter = require('./routes/post');
const db = require('./models');

const app = express(); //한번 호출 해주어야 한다.

db.sequelize.sync()
    .then(()=> {
        console.log('db연결 성공');
    })
    .catch(console.error);

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

app.get('/',(req,res)=>{ // '/api' url , get 메서드
    res.send('안녕! api');
})
app.get('/posts',(req,res)=>{
    res.json([
        {id: 1, content: 'vervon'},
        {id: 2, content: 'jin'},
        {id: 3, content: 'vermouth'},
    ]);
})

app.use('/post',postRouter);

app.listen(3065, () => {
    console.log('서버 실행 중 입니댜');
})