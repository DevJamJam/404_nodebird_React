module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', { 
        // id 가 기본적으로 들어있음... 
        src:{
            type: DataTypes.STRING(200),
            allowNull: true, //필수가 아니다 
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post);
    };
    return Image;
}