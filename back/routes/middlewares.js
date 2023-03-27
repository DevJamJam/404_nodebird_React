exports.isLoggedIn = (req,res,next) => {
    if (req.isAuthenticated()) {
        next(); //error를 넣으면 error처리 미들웨어 , 아무것도 안 넣으면 다음 미들웨어로 
    } else {
        res.status(401).send('로그인이 필요합니다.');
    }
}

exports.isNotLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
    }
}