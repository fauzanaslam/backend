import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";

interface NewsAttributes {
  id?: number;
  header?: string | null;
  subHeader?: string | null;
  image?: string | null;
  url?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsInput extends Optional<NewsAttributes, "id"> {}
export interface NewsOutput extends Required<NewsAttributes> {}

class News extends Model<NewsAttributes, NewsInput> implements NewsAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

News.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    header: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subHeader: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: connection,
    underscored: false,
  }
);
export default News;
