const path = require('path');
const db = require('./db');
const {Department, Employee} = db.models

const express = require('express');
const app = express();
app.use(require('body-parser').json());

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/employees', async (req, res, next) => {
  try {
    const employee = await Employee.findAll({
      include: [{model: Department}]
    })
    res.send(employee)
  }
  catch(err){
    console.log(err)
  }
})

app.get('/api/departments', async (req, res, next) => {
  try {
    res.send(await Department.findAll())
  }
  catch(err){
    console.log(err)
  }
})

app.delete('/api/employees/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    await employee.destroy();
    res.sendStatus(204);
  }
  catch(err){
    console.log(err)
  }
})

app.put('/api/employees/:id', async (req, res, next) => {
  try {
    console.log(req.params.id)
    const employee = await Employee.findByPk(req.params.id);
    employee.departmentId = 1;
    await employee.save();
    res.send(employee)
  }
  catch(err){
    console.log(err)
  }
})


const init = async()=> {
    try {
      await db.syncAndSeed();
      const port = process.env.PORT || 3000;
      app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(ex){
      console.log(ex);
    }
  };

  init();