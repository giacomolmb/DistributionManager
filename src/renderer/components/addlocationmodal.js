import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";

export default function AddLocationModal(props) {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const onSubmit = async (data) => {
        data.location.association_id = props.associationId;
        const result = await window.api.insertLocation({location: data.location});
        if(props.locations){
            props.locations.push(JSON.parse(result));
        }
        props.handleClose();
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add new location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="new-location-div">
                        <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3">
                                <Form.Label>Country</Form.Label>
                                <Form.Control 
                                    placeholder="Country"
                                    {...register('location.country')}
                                    type='text'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Control 
                                    placeholder="City"
                                    {...register('location.city')}
                                    type='text'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control 
                                    placeholder="Address"
                                    {...register('location.address')}
                                    type='text'
                                />
                            </Form.Group>
                            <Button type='submit'>Add location</Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}