import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";
import sequelize from "../config/db";

export const User = sequelize.define(
    "tbUsuario",
    {
        idUsuario:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
        email:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        nome:{
            type: DataTypes.STRING,
            allowNull: true
        },
        senha:{
            type: DataTypes.STRING,
            allowNull: true
        },
        idTipoUsuario:{
            type: DataTypes.INTEGER,
            defaultValue: 2,
            allowNull: true
        }
    }
)

const User = {
    async findByEmail(email) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM tbUsuario WHERE email = ?', [email]);
        return rows[0];
    },

    async create({ nome, email, senha }) {
        const connection = await connectDB();
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        await connection.execute(
            'INSERT INTO tbUsuario (nome, email, senha, idTipoUsuario) VALUES (?, ?, ?, ?)',
            [nome, email, senhaHash, 2]
        );
    }
};

module.exports = User;