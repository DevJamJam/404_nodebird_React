module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', { 
        // id 가 기본적으로 들어있음... 
        name:{
            type: DataTypes.STRING(20),
            allowNull: true, //필수가 아니다 
        },
    }, {
        charset: 'utf8mb4', //이모티콘 저장
        collate: 'utf8mb4_general_ci', //이모티콘 저장 
    });
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, {through:'PostHashtag'}); //다대다 관계
    };
    return Hashtag;
}