import express from 'express';
import cors from "cors";
import employees from "../data/employees.js";
import projects from "../data/projects.js";

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => res.send("The app is up and running"));

// PROJECTS
app.get("/projects", (req, res) => {
    const { projectName } = req.query;

    if (projectName === undefined)
        return res.status(200).json(projects)

    const projectList = projects.filter((project) => project.projectName === projectName);

    if (projectList.length < 1)
        return res.status(404).json("Can't find project with name " + projectName);

    return res.status(200).json(projectList);
})
app.post("/projects", (req, res) => {
    const { projectName, description, startDate, members } = req.body;

    console.log("Creating a new project..");
    console.log(req.body);

    if (members.length < 1)
        res.status(404).json("A project must have at least 1 member.");

    const newProject = { projectName, description, startDate, members };
    projects.push(newProject);

    res.status(201).json(newProject);
});

// EMPLOYEES
app.get("/employees", (req, res) => {
    const { department } = req.query;

    if (department === undefined)
        return res.status(200).json(employees.map(employee => employee.name));

    const departmentEmployees = employees.filter((employee) => employee.department == department).map(employee => employee.name);

    if (departmentEmployees.length < 1)
        return res.status(404).json("No employees under this department found.");

    return res.status(200).json(departmentEmployees);
});
app.get("/employees/:id", (req, res) => {
    const employeeId = parseInt(req.params.id);
    const employeeRecord = employees.find(employee => employee.id === employeeId);

    res.status(200).json(employeeRecord);
})

app.listen(PORT, () => console.log(`Hello World, I'm listening at port ${PORT}`));