module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add a name' },
        len: {
          args: [1, 100],
          msg: 'Name cannot be more than 100 characters'
        }
      }
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add a description' },
        len: {
          args: [1, 500],
          msg: 'Description cannot be more than 500 characters'
        }
      }
    },
    category: {
      type: DataTypes.ENUM(
        'Roblox',
        'Riot Games',
        'PlayStation',
        'Xbox',
        'Steam',
        'Nintendo',
        'Other'
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add a category' }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add a price' },
        min: {
          args: [0],
          msg: 'Price must be at least 0'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Stock cannot be negative'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: 'no-photo.jpg',
    },
    provider: {
      type: DataTypes.ENUM('SEAGM', 'Kinguin', 'Digiseller', 'Manual'),
      defaultValue: 'Manual',
    },
    providerProductId: {
      type: DataTypes.STRING,
      default: '',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    averageRating: {
      type: DataTypes.FLOAT,
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
    numReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
  });

  // Associations
  Product.associate = function(models) {
    // A product can have many order items
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems',
      onDelete: 'CASCADE',
      hooks: true
    });

    // A product can have many reviews
    Product.hasMany(models.Review, {
      foreignKey: 'productId',
      as: 'reviews'
    });
  };

  return Product;
};
