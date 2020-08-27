const Sequelize = require('sequelize');
const {STRING} = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_employee');
const faker = require('faker');

const Department = conn.define('department', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})

const Employee = conn.define('employee', {
    name: {
        type: STRING,
        allowNull: false,
        validate: {
        notEmpty: true
        },
    },
    role: {
        type: STRING,
    }
});

Employee.belongsTo(Department);
Department.hasMany(Employee);

const syncAndSeed = async()=> {
    await conn.sync({ force: true });
    const [ none, hr, research, manufacturing, sales, tech] = await Promise.all([
        Department.create({name: 'Employees Without Departments'}),
        Department.create({name: 'HR'}),
        Department.create({name: 'Research'}),
        Department.create({name: 'Manufacturing'}),
        Department.create({name: 'Sales'}),
        Department.create({name: 'Tech'})
    ])
    const ids = [hr.id, research.id, manufacturing.id, sales.id, tech.id]
    for (let i = 0; i < 50; i++) {
        const num = Math.floor(Math.random() * ids.length);
        await Employee.create({name: faker.name.firstName(), departmentId: ids[num]})
    }
};


module.exports = {
    models: {
        Department,
        Employee
    },
    syncAndSeed
};