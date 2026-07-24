import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import User from './User';
import Post from './Post';

interface LikeAttributes {
  id: number;
  userId: number;
  postId: number;
}

interface LikeCreationAttributes extends Optional<LikeAttributes, 'id'> {}

class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
  declare id: number;
  declare userId: number;
  declare postId: number;
}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Like',
    tableName: 'likes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId'],
      },
    ],
  }
);

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });

export default Like;
