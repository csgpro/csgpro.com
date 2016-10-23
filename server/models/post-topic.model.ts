export default function defineModel(sequelize, DataTypes) {
    return sequelize.define('postTopic', {}, { timestamps: false });
}