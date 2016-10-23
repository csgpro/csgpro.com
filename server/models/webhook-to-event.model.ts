export default function defineModel(sequelize, DataTypes) {
    return sequelize.define('webhookToEvent', {}, { timestamps: false });
}