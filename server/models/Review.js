module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'Rating must be at least 1'
        },
        max: {
          args: [5],
          msg: 'Rating cannot be more than 5'
        }
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  // Associations
  Review.associate = function(models) {
    // A review belongs to a user
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });

    // A review belongs to a product
    Review.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
      onDelete: 'CASCADE'
    });
  };

  // Hooks
  Review.afterSave(async (review, options) => {
    await updateProductRating(review, options);
  });

  Review.afterDestroy(async (review, options) => {
    await updateProductRating(review, options);
  });

  // Helper function to update product rating
  const updateProductRating = async (review, options) => {
    try {
      const { Product, Review } = review.sequelize.models;
      
      // Get all reviews for this product
      const reviews = await Review.findAll({
        where: { productId: review.productId },
        transaction: options?.transaction
      });
      
      if (reviews.length > 0) {
        // Calculate average rating
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;
        const numReviews = reviews.length;
        
        // Update the product's rating
        await Product.update(
          { 
            averageRating: parseFloat(averageRating.toFixed(1)),
            numReviews
          },
          {
            where: { id: review.productId },
            transaction: options?.transaction
          }
        );
      } else {
        // No reviews, reset to default
        await Product.update(
          { 
            averageRating: null,
            numReviews: 0
          },
          {
            where: { id: review.productId },
            transaction: options?.transaction
          }
        );
      }
    } catch (err) {
      console.error('Error updating product rating:', err);
    }
  };

  return Review;
};
