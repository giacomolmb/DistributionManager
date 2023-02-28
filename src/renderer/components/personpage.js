import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Col, ListGroup, Row, Table, Modal, Form  } from "react-bootstrap";

export default function PersonPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });
    
    const params = useParams()

    const [person, setPerson] = useState({})

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        async function fetchData(){
            const result = await window.api.findPersonById({id: params.id});
            setPerson(JSON.parse(result));
        }

        fetchData()
    }, [])

    const onSubmit = async (data) => {
        const result = await window.api.insertFamilyMember({familyMember: data.family_member});
        result !== null ? person.family_members?.push(JSON.parse(result)) : null;
        handleClose()
    }

    return (
        <div>
            <h1>
                {
                    (person.name !== null && person.surname !== null) ? person.name + " " + person.surname : "Loading..."
                }
            </h1>
            <ListGroup as="ol">
                {
                    person.birth_date !== null && person.birth_date !== null ? 
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                                Birth date
                                <div className="fw-bold">{person.birth_date}</div>
                            </div>
                        </ListGroup.Item>
                    : null
                }
                {
                    person.religion !== "" && person.religion !== null ? 
                        <ListGroup.Item as="li">Religion: <b>{person.religion}</b></ListGroup.Item>
                    : null
                }
                {
                    person.marital_status !== "" && person.marital_status !== null ? 
                        <ListGroup.Item as="li">Marital Status: <b>{person.marital_status}</b></ListGroup.Item>
                    : null
                }
                {
                    person.mobile_number !== "" && person.mobile_number !== null ? 
                        <ListGroup.Item as="li">Mobile Number: <b>{person.mobile_number}</b></ListGroup.Item>
                    : null
                }
                {
                    person.email !== "" && person.email !== null ? 
                        <ListGroup.Item as="li">E-Mail: <b>{person.email}</b></ListGroup.Item>
                    : null
                }
                {
                    (person.document_type !== "" && person.document_number !== "" && person.document_type !== null && person.document_number !== null ) ? 
                        <ListGroup.Item as="li">Document: <b>{person.document_type} {person.document_number}</b></ListGroup.Item>
                    : null
                }
                {
                    (person.country !== "" && person.city !== "" && person.address !== "" && person.country !== null && person.city !== null && person.address !== null ) ? 
                        <ListGroup.Item as="li">Address: <b>{person.address}, {person.city}, {person.country}</b></ListGroup.Item>
                    : null
                }
                {
                    person.diseases !== "" && person.diseases !== null ? 
                        <ListGroup.Item as="li">Diseases: <b>{person.diseases}</b></ListGroup.Item>
                    : null
                }
                {
                    person.notes !== "" && person.notes !== null ? 
                        <ListGroup.Item as="li">Notes: <b>{person.notes}</b></ListGroup.Item>
                    : null
                }
            </ListGroup>
            <br />
            {
                person.family_members?.length > 0  ? 
                    <div id="family-members-div">
                        <h3>Family members:</h3>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>Date of Birth</th>
                                    <th>Document</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    person.family_members?.map((family_member) => {
                                        return (
                                            <tr key={family_member.id} className={params.familiar_id == family_member.id ? "table-primary" : null}>
                                                <td>{family_member.name}</td>
                                                <td>{family_member.surname}</td>
                                                <td>{family_member.birth_date}</td>
                                                <td>{family_member.document_type} - {family_member.document_number}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                :
                    null
            }
            <Button onClick={handleShow}>Add Family Member</Button>
            {
                person.interventions?.length > 0  ? 
                    <div id="interventions-div">
                        <hr />
                        <br />
                        <h3>Latest interventions:</h3>
                        <ListGroup variant="flush">
                            {
                                person.interventions?.slice(0,5).map(intervention => {
                                    return (
                                            <ListGroup.Item key={intervention.id} as={Link} to={`/intervention/${intervention.id}`}>
                                                {intervention.date} - {intervention.city}, {intervention.country}
                                            </ListGroup.Item>
                                        )
                                    })
                            }
                        </ListGroup>
                    </div>
                :
                    null
            }
            <hr />
            <br />
            <div className="d-grid gap-2">
                <Row>
                    <Col>
                        <Button as={Link} style={{width: '100%'}} variant="primary" size="lg" to={`/person/${params.id}/newintervention`}>Add Intervention</Button>
                    </Col>
                    <Col>
                        <Button as={Link} style={{width: '100%'}} variant="success" size="lg" to={`/person/${params.id}/edit`}>Edit profile</Button>
                    </Col>
                </Row>
                <Button variant="secondary" as={Link} to="/">
                    Back to homepage
                </Button>
            </div>

            <br />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Family Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="new-family-member-div">
                        <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                            <input type="hidden" value={params.id} {...register('family_member.referent_family_member_id')} />
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    placeholder="Name"
                                    {...register('family_member.name')}
                                    type='text'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Surname</Form.Label>
                                <Form.Control 
                                    placeholder="Surname"
                                    {...register('family_member.surname')}
                                    type='text'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control 
                                    placeholder="Surname"
                                    {...register('family_member.birth_date')}
                                    type='date'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Document Type</Form.Label>
                                <Form.Select
                                        {...register(`family_member.document_type`)}
                                        type='text'
                                    >
                                        <option value="">Document type</option>
                                        <option value="CI">Identity Card</option>
                                        <option value="Passport">Passport</option>
                                    </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Document Number</Form.Label>
                                <Form.Control 
                                    placeholder="Document Number"
                                    {...register('family_member.document_number')}
                                    type='text'
                                />
                            </Form.Group>
                            <Button type='submit'>Add Family Member</Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

        </div>

    );
}