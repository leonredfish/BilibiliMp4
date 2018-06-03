module.exports = function(sequelize, DataTypes) {
  return sequelize.define('c_client_list', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.STRING(64),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: 0
    },
    tdate: {
      type: DataTypes.DATE,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    remove_date: {
      type: DataTypes.DATE,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    b_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: 0
    },
  }, {
    tableName: 'c_client_list'
  });
};