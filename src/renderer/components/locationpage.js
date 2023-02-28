import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { Table, Modal, Button, Form } from "react-bootstrap";

export default function LocationPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });
    
    const params = useParams();

    const [location, setLocation] = useState({})
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    useEffect(() => {
        async function fetchData(){
            const result = await window.api.getLocation({locationId: params.id});
            setLocation(JSON.parse(result));
        }

        fetchData();
    }, []);

    const onSubmit = async (data) => {
        data.referent.location_id = location.id;
        const result = await window.api.insertReferent({referent: data.referent});
        document.querySelector("#new-referent-div").style.display = "none"
        result !== null ? location.referents?.push(JSON.parse(result)) : null;
        handleClose()
    }

    const showLocationDiv = () => {
        document.querySelector("#new-referent-div").style.display = "block"
    }

    return (
        <div>
            <h1 className="display-4">{location.association?.name}</h1>
            <p className="lead">{location.address}, {location.city}, {location.country}</p>
            <h4>Referents:</h4>
            <Table striped>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Mobile</th>
                        <th>E-Mail</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        location.referents?.map((referent) => {
                            return (
                                <tr key={referent.id}>
                                    <td>{referent.name}</td>
                                    <td>{referent.role}</td>
                                    <td>{referent.mobile_number}</td>
                                    <td>{referent.email}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            
            <br />

            <div className="d-grid gap-2">
                <Button type="button" onClick={handleShow} variant="primary" size="lg">
                    Add new referent
                </Button>
                <Button type="button" variant="secondary" as={Link} to={"/associations/"+location.association?.id}>
                    Back to association page
                </Button>
                <Button type="button" variant="secondary" as={Link} to="/">
                    Back to home page
                </Button>
            </div>
            
            <br />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add new referent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="new-referent-div">
                        <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    {...register('referent.name')}
                                    placeholder="Name"
                                    type='text'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Control 
                                    {...register('referent.role')}
                                    placeholder="Role"
                                    type='text'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control 
                                    {...register('referent.mobile_number')}
                                    placeholder="Mobile Number"
                                    type='text'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    {...register('referent.email')}
                                    placeholder="Email"
                                    type='text'
                                />
                            </Form.Group>
                            <Button type='submit'>Add referent</Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}