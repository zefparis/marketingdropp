'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // D'abord, supprimer la contrainte de type ENUM si elle existe
      await queryInterface.sequelize.query(
        `ALTER TABLE "orders" ALTER COLUMN "provider" TYPE VARCHAR(255);`,
        { transaction }
      );

      // Supprimer le type ENUM s'il existe
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_orders_provider";`,
        { transaction }
      );

      // Ajouter un commentaire à la colonne
      await queryInterface.sequelize.query(
        `COMMENT ON COLUMN "orders"."provider" IS 'The provider from which the order originates';`,
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    // Dans le cas où vous voudriez revenir en arrière
    // Note: Cette opération pourrait échouer si des données non valides sont présentes
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Créer le type ENUM
      await queryInterface.sequelize.query(
        `CREATE TYPE "enum_orders_provider" AS ENUM('SEAGM', 'Kinguin', 'Digiseller', 'Manual');`,
        { transaction }
      );

      // Mettre à jour la colonne pour utiliser le type ENUM
      await queryInterface.sequelize.query(
        `ALTER TABLE "orders" ALTER COLUMN "provider" TYPE "enum_orders_provider" 
         USING ("provider"::text::"enum_orders_provider");`,
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
