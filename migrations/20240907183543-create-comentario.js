'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comentarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      texto: {
        type: Sequelize.STRING
      },
      resposta: {
        type: Sequelize.STRING
      },
      imgComentario: {
        type: Sequelize.STRING
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        references:{
          model:"usuarios",
          key:"id"
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
      },
      duvidaId: {
        type: Sequelize.INTEGER,
        references:{
          model:"duvidas",
          key:"id"
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comentarios');
  }
};