const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
    static init(sequelize) {
        return super.init({
        // id 가 기본적으로 들어있음... 
            name: {
                type: DataTypes.STRING(20),
                allowNull: true, //필수가 아니다 
            },
        }, {
            modelName: 'Hashtag',
            tableName: 'hashtags',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci', // 이모티콘 저장
            sequelize,
        });
    }
    static associate(db) {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' }); //다대다 관계
    }
};
