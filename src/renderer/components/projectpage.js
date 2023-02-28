import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { Table, Modal, Button, Form } from "react-bootstrap";

export default function ProjectPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });
    
    const params = useParams();

    const [project, setProject] = useState({})


    useEffect(() => {
        async function fetchData(){
            const result = await window.api.getProject({projectId: params.id});
            setProject(JSON.parse(result));
        }

        fetchData();
    }, []);

    return (
        <div>
            <h1 className="display-4">{project.code} - {project.country}</h1>
            <p className="lead">{project.notes}</p>
            <h4>Interventions:</h4>
            <Table striped>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Person</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        project.interventions?.map((intervention) => {
                            return (
                                <tr key={intervention.id}>
                                    <td>{intervention.date}</td>
                                    <td>{intervention.city}, {intervention.country}</td>
                                    <td><Link to={`/person/${intervention.person.id}`}>{intervention.person.name} {intervention.person.surname}</Link></td>
                                    <td><Link to={`/intervention/${intervention.id}`}>View details</Link></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            
            <br />

            <div className="d-grid gap-2">
                <Button type="button" variant="secondary" as={Link} to={"/associations/"+location.association?.id}>
                    Back to projects list
                </Button>
                <Button type="button" variant="secondary" as={Link} to="/">
                    Back to home page
                </Button>
            </div>
            
            <br />
        </div>
    );
}