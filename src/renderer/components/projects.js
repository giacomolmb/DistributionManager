import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ListGroup, Button, Modal, Form, InputGroup } from "react-bootstrap";
import AddProjectModal from "./addprojectmodal";

export default function Projects() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const [projects, setProjects] = useState([]);
    const [filtered, setFiltered] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchData = async () => {
        const result = await window.api.getProjects();
        setProjects(JSON.parse(result));
    }

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        const results = await window.api.searchProject({searchText: data.input});
        setProjects(JSON.parse(results));
        if(data.input !== "")
            setFiltered(true);
    }

    return (
        <div>
            <h1 className="display-4">Projects</h1>

            <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                <input type="submit" hidden/>
                <InputGroup className="mb-3">
                    <Form.Control
                        {...register('input')}
                        type='text'
                        placeholder="Filter project by code or country"
                    />
                    <Button variant="outline-success" type="submit" id="button-addon2">
                        Search
                    </Button>
                </InputGroup>
            </form>


            <div id="projects-list">
                <ListGroup>
                    {
                        projects.map((project) => {
                            return (
                                <ListGroup.Item key={project.id} as={Link} to={"/projects/" + project.id}>
                                    {project.code} ({project.country})
                                </ListGroup.Item>
                            )
                        })
                    }
                </ListGroup>
            </div>

            <br />

            <div className="d-grid gap-2">
                <Button type="button" onClick={handleShow} variant="primary" size="lg">
                    Create new project
                </Button>
                <Button type="button" variant="secondary" as={Link} to="/">
                    Back to home page
                </Button>
            </div>

            <br />

            <AddProjectModal show={show} handleClose={handleClose} projects={projects}/>
        </div>
    );
}