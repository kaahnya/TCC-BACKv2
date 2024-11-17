'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class duvida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.usuario,{as:"usuario"}),
      this.hasMany(models.comentario,{as:"comentario"})
    }
  }
  duvida.init({
    titulo: DataTypes.STRING,
    materia: DataTypes.STRING,
    conteudo: DataTypes.STRING,
    descDuvida: DataTypes.STRING,
    duvidaImg: DataTypes.STRING,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'duvida',
  });
  return duvida;
};