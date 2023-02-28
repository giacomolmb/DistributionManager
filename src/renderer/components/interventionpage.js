import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, ListGroup, Card, Table } from "react-bootstrap";

export default function InterventionPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });
    
    const params = useParams();

    const navigate = useNavigate();

    const [intervention, setIntervention] = useState({})

    useEffect(() => {
        async function fetchData(){
            const result = await window.api.getIntervention ({interventionId: params.id});
            result !== null ? setIntervention(JSON.parse(result)): null
        }

        fetchData();
    }, []);

    const deleteIntervention = async () => {
        const result = await window.api.deleteIntervention({interventionId: params.id});
        result !== null ? navigate(`/person/${intervention.person?.id}`) : null
    }

    return (
        <div>
            <h1 className="display-4">Intervention details</h1>

            <ListGroup as="ol">
                {
                    intervention.project?.code !== "" ? 
                        <ListGroup.Item as="li">Project: <b><Link to={`/projects/${intervention.project?.id}`}>{intervention.project?.code} ({intervention.project?.country})</Link></b></ListGroup.Item>
                    : null
                }
                {
                    intervention.name !== "" ? 
                        <ListGroup.Item as="li">Person: <b><Link to={`/person/${intervention.person?.id}`}>{intervention.person?.name} {intervention.person?.surname}</Link></b></ListGroup.Item>
                    : null
                }
                {
                    intervention.date !== "" ? 
                        <ListGroup.Item as="li">Date: <b>{intervention.date}</b></ListGroup.Item>
                    : null
                }
                {
                    intervention.city !== "" ? 
                        <ListGroup.Item as="li">Place: <b>{intervention.city}, {intervention.country}</b></ListGroup.Item>
                    : null
                }
                {
                    intervention.city !== "" ? 
                        <ListGroup.Item as="li">Notes: {intervention.notes}</ListGroup.Item>
                    : null
                }
            </ListGroup>

            

            {
                intervention.materials_specified == "true" ?
                    <Card style={{marginTop: '10px'}}>
                        <Card.Body>
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>Material type</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        intervention.materials?.map(material => {
                                            return(
                                                <tr key={material.id}>
                                                    <td>{material.type}</td>
                                                    <td>{material.qty} {material.measure}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                : null
            }

            <br />

            <div className="d-grid gap-2">
                <Button variant="danger" onClick={deleteIntervention}>
                    Delete Intervention
                </Button>
                <Button variant="secondary" as={Link} to={`/person/${intervention.person?.id}`}>
                    Back to person page
                </Button>
                <Button variant="secondary" as={Link} to="/">
                    Back to homepage
                </Button>
            </div>

            <br />
        </div>
    );
}