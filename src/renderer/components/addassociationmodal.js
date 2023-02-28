import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";

export default function AddAssociationModal(props) {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const onSubmit = async (data) => {
        const association = data.association;    
        const result = await window.api.insertAssociation({association: association}) 
        if(props.associations){
            props.associations.push(JSON.parse(result))
        }
        props.handleClose()
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add new association</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="new-association-div">
                        <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3">
                                <Form.Label>Association Name</Form.Label>
                                <Form.Control 
                                    placeholder="Association Name"
                                    {...register('association.name')}
                                    type='text'
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Association Type</Form.Label>
                                <Form.Control 
                                    placeholder="Association Type"
                                    {...register('association.type')}
                                    type='text'
                                />
                            </Form.Group>
                            <Button type='submit'>Add association</Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}