import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ListGroup, Button, Modal, Form, InputGroup } from "react-bootstrap";
import AddAssociationModal from "./addassociationmodal";

export default function AssociationList() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const [associations, setAssociations] = useState([]);
    const [filtered, setFiltered] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchData = async () => {
        const result = await window.api.getAssociations();
        setAssociations(result);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        const results = await window.api.searchAssociation({searchText: data.input});
        setAssociations(results);
        if(data.input !== "")
            setFiltered(true);
    }

    return (
        <div>
            <h1 className="display-4">Associations List</h1>

            <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                <input type="submit" hidden/>
                <InputGroup className="mb-3">
                    <Form.Control
                        {...register('input')}
                        type='text'
                        placeholder="Insert association name"
                    />
                    <Button variant="outline-success" type="submit" id="button-addon2">
                        Search
                    </Button>
                </InputGroup>
            </form>


            <div id="associations-list">
                <ListGroup>
                    {
                        associations.map((association) => {
                            return (
                                <ListGroup.Item key={association.id} as={Link} to={"/associations/" + association.id}>
                                    {association.name}
                                </ListGroup.Item>
                            )
                        })
                    }
                </ListGroup>
            </div>

            <br />

            <div className="d-grid gap-2">
                <Button type="button" onClick={handleShow} variant="primary" size="lg">
                    Add new association
                </Button>
                <Button type="button" variant="secondary" as={Link} to="/">
                    Back to home page
                </Button>
            </div>

            <br />

            <AddAssociationModal show={show} handleClose={handleClose} associations={associations}/>
        </div>
    );
}