import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('dbCalendarioJLB', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    await sequelize.authenticate();
    console.log('Conectado ao banco de dados MySQL');
} catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
}

export default sequelize;