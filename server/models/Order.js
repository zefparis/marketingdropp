module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Total price must be at least 0'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.ENUM('stripe', 'paypal', 'bank_transfer'),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add a payment method' }
      }
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    billingAddress: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [['SEAGM', 'Kinguin', 'Digiseller', 'Manual']],
          msg: 'Provider must be one of: SEAGM, Kinguin, Digiseller, Manual'
        }
      },
      comment: 'The provider from which the order originates'
    },
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: 'orders',
    indexes: [
      // Suppression des index qui sont déjà définis dans les migrations
      // ou qui sont créés automatiquement par les associations
    ]
  });

  // Associations
  Order.associate = function(models) {
    // An order belongs to a user
    Order.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false
      },
      as: 'user',
      onDelete: 'RESTRICT' // Prevent deletion of user if they have orders
    });

    // An order has many order items
    Order.hasMany(models.OrderItem, {
      foreignKey: {
        name: 'orderId',
        field: 'order_id',
        allowNull: false
      },
      as: 'items',
      onDelete: 'CASCADE',
      hooks: true
    });
  };

  // Hooks
  Order.afterSave(async (order, options) => {
    await updateProductTotalSales(order, options);
  });

  Order.afterDestroy(async (order, options) => {
    await updateProductTotalSales(order, options);
  });

  // Helper function to update product total sales
  const updateProductTotalSales = async (order, options) => {
    try {
      const { OrderItem, Product } = order.sequelize.models;
      
      // Get all order items for this order
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
        transaction: options?.transaction
      });
      
      // Update total sales for each product in the order
      for (const item of orderItems) {
        const productId = item.productId;
        
        // Calculate total sales for this product across all orders
        const result = await OrderItem.sum('quantity', {
          include: [{
            model: Order,
            where: { 
              paymentStatus: 'paid',
              id: order.id // Only count this order
            },
            required: true
          }],
          where: { productId },
          transaction: options?.transaction
        });
        
        // Update the product's total sales
        await Product.update(
          { totalSales: result || 0 },
          {
            where: { id: productId },
            transaction: options?.transaction
          }
        );
      }
    } catch (err) {
      console.error('Error updating product total sales:', err);
    }
  };

  // Static method to get total sales for a product
  Order.getTotalSales = async function(productId) {
    try {
      const { OrderItem } = this.sequelize.models;
      
      const totalSales = await OrderItem.sum('quantity', {
        include: [{
          model: this,
          where: { paymentStatus: 'paid' },
          required: true
        }],
        where: { productId }
      });
      
      return totalSales || 0;
    } catch (err) {
      console.error('Error getting total sales:', err);
      return 0;
    }
  };

  return Order;
};
