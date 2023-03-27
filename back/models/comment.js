module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', { 
        // id 가 기본적으로 들어있음... 
        content:{
            type: DataTypes.TEXT,
            allowNull: false, //필수 
        },
    }, {
        charset: 'utf8mb4', //이모티콘 저장
        collate: 'utf8mb4_general_ci', //이모티콘 저장 
    });
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    };
    return Comment;
}