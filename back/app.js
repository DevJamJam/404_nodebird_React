const http = require('http');
const server = http.createServer((req,res)=>{
    //요청에 대한 정보 req 
    //응답에 대한 정보 res 
    console.log(req.url, req.method);
    res.write('Hello nodebirds');// 여러줄을 치고 싶다 => res.write()
    res.end('Hello node'); //마지막에만 .. res.end() 
    // () 안에 html도 넣을 수 있다. 
});
server.listen(3065,()=>{
    console.log('서버는 실행중');
});
/*
    createServer라는 곳에서 요청메서드나 url에 따라서 응답을 해준다. 
    프론트 서버나 브라우저가 요청을 보내면 응답을 해준다 => 서버 
    요청 한번 당 응답 한번 , 아예 안보내도 안되고 무조건 요청을 보내야 한다.
    응답을 안 보내면 특정시간 (30초정도)후에 브라우저가 자동으로 응답 실패로 처리해버린다.

    요청과 응답은 1:1 .. 
    응답 두번 보내지않게 조심해야 한다 res.end 2번 보내면 안된다. 

    노드 자체가 서버 X , 노드 자체에서 제공하는 http 모듈이 서버 
*/