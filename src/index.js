const React = require('react');
import { render } from 'react-dom';
const axios = require('axios');

class Main extends React.Component{
    constructor() {
        super();
        this.state = {
            departments: [],
            employees: []
        };
        this.destroy = this.destroy.bind(this);
        this.remove = this.remove.bind(this);
    }
    async destroy(employeeId) {
       await axios.delete(`/api/employees/${employeeId}`);
       const employees = this.state.employees.filter(elem => elem.id !== employeeId)
       this.setState({employees});
    }

    async remove(employeeId) {
        const employee = (await axios.put(`/api/employees/${employeeId}`)).data;
        console.log(employee)
        const employees = this.state.employees.map(element => element.id === employee.id ? employee : element)
        this.setState({employees});
    }
    async componentDidMount() {
        const employee = await axios.get('/api/employees');
        const department = await axios.get('/api/departments');
        this.setState({
            departments: department.data,
            employees: employee.data
        });
    }
    getEmployeesByDepartment(department) {
        const {departments, employees} = this.state
        return employees.filter(elem => elem.departmentId === department.id)
    }
    render() {
        const {departments, employees} = this.state;
        return (
            <div>
                <h1>ACME Employees and Departments</h1>
                <div>{this.state.employees.length} Total Employees</div>
                <div id='departments'>
                    {
                        departments.map(element => {
                            return (
                                <div className={`${element.name} column`} id={element.id} key={element.id}>
                                    {element.name} ({this.getEmployeesByDepartment(element).length})
                                    {
                                        this.getEmployeesByDepartment(element).map(emp => {
                                            return (
                                                <div key={emp.id} className='employee'>
                                                    <div>{emp.name}</div>
                                                    <button onClick={() => this.destroy(emp.id)}>x</button>
                                                    <button onClick={() => this.remove(emp.id)}>Remove from Department</button>
                                               </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}


render(<Main />, document.querySelector('#root'));
