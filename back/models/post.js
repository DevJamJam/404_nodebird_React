const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Post extends Model {
    static init(sequelize) {
        return super.init({
        // id가 기본적으로 들어있다.
            content: {
                type: DataTypes.TEXT,
                allowNull: false, //필수
            },
        // RetweetId
        }, {
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci', // 이모티콘 저장
            sequelize,
        });
    }
    static associate(db) {
        db.Post.belongsTo(db.User); //Post.addUser  Post.setUser Post.removeUser
        db.Post.belongsToMany(db.Hashtag, {through:'PostHashtag'}); //다대다 관계  Post.addHashtags
        db.Post.hasMany(db.Comment); // Post.addComments
        db.Post.hasMany(db.Image); // Post.addImage
        db.Post.belongsTo(db.Post, {as: 'Retweet'}); //리트윗 , 1대 다  Post.addRetweet
        db.Post.belongsToMany(db.User, {through: 'Like' , as: 'Likers'}); //Post.addlikers  Post.removeLikers
        //생성되는 중간 테이블의 이름을 변경 through , 상단의 hasMany(db.Post)와 구별 하기위해 별칭붙여주기 as 
        // add get set remove 제공 => get은 상대적으로 덜 쓰인다. 
    }
};
