
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Post extends Model {
    static init(sequelize) {
        return super.init({
        // id가 기본적으로 들어있다.
            email: {
                type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
                allowNull: false, // 필수
                unique: true, // 고유한 값
            },
            nickname: {
                type: DataTypes.STRING(30),
                allowNull: false, // 필수
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false, // 필수
            },
        }, {
        modelName: 'User',
        tableName: 'users',
        charset: 'utf8',
        collate: 'utf8_general_ci', // 한글 저장
        sequelize,
        });
    }
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Likers' })
        //생성되는 중간 테이블의 이름을 변경 through , 상단의 hasMany(db.Post)와 구별 하기위해 별칭붙여주기 as 
        //다대다 관계에서는 중간 테이블이 생긴다 => belongsToMany()
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
        // 같은 table 내  through가 같을땐 foreignKey 설정 =>컬럼명 변경 
    }
};
