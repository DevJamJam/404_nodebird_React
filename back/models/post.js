module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { 
        // id 가 기본적으로 들어있음... 
        content:{
            type: DataTypes.TEXT,
            allowNull: false, //필수 
        },
    }, {
        charset: 'utf8mb4', //이모티콘 저장
        collate: 'utf8mb4_general_ci', //이모티콘 저장 
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, {through:'PostHashtag'}); //다대다 관계 
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, {as: 'Retweet'}); //리트윗 , 1대 다 
        db.Post.belongsToMany(db.User, {through: 'Like' , as: 'Liked'}); 
        //생성되는 중간 테이블의 이름을 변경 through , 상단의 hasMany(db.Post)와 구별 하기위해 별칭붙여주기 as 
    };
    return Post;
}