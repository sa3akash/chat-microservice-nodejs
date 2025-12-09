import { DataTypes, Model } from 'sequelize';

import type { Optional } from 'sequelize';

import { sequelize } from '@/config';
import { UserInterface } from '@chat/common';

export type UserCreationAttributes = Optional<UserInterface, 'id' | 'createdAt' | 'updatedAt'>;

export class UserModel
  extends Model<UserInterface, UserCreationAttributes>
  implements UserInterface
{
  declare id: string;
  declare email: string;
  declare displayName: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
);
