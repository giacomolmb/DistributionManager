import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { ListGroup, Modal, Button, Form } from "react-bootstrap";
import AddLocationModal from "./addlocationmodal";

export default function AssociationPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const params = useParams();

    const [association, setAssociation] = useState({})

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    useEffect(() => {
        async function fetchData(){
            const result = await window.api.getAssociation({associationId: params.id});
            setAssociation(JSON.parse(result));
        }

        fetchData();
    }, []);

    const onSubmit = async (data) => {
        data.location.association_id = association.id;
        const result = await window.api.insertLocation({location: data.location});
        result !== null ? association.locations?.push(JSON.parse(result)) : null;
        document.querySelector("#new-location-div").style.display = "none"
        handleClose()
    }

    const showLocationDiv = () => {
        document.querySelector("#new-location-div").style.display = "block"
    }

    return (
        <div>
            <h1 className="display-4">{association.name ? association.name : "Loading..."}</h1>
            {
                association.name ? <p className="lead">{association.type}</p> : null
            }

            <div id="association-locations">
                <h4>Locations: </h4>
                <ListGroup>
                    {
                        association.locations?.map((location) => {
                            return (
                                <ListGroup.Item key={location.id} as={Link} to={"/locations/" + location.id}>
                                    {location.address}, {location.city}, {location.country}
                                </ListGroup.Item>
                            )
                        })
                    }
                </ListGroup>
            </div>

            <br />

            <div className="d-grid gap-2">
                <Button type="button" onClick={handleShow} variant="primary" size="lg">
                    Add new location
                </Button>
                <Button type="button" variant="secondary" as={Link} to="/associations">
                    Back to association list
                </Button>
                <Button type="button" variant="secondary" as={Link} to="/">
                    Back to home page
                </Button>
            </div>

            <br />

            <AddLocationModal associationId={params.id} show={show} handleClose={handleClose} locations={association.locations} />
        </div>
    );
}