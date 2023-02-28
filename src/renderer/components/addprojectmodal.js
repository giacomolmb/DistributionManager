import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";

export default function AddProjectModal(props) {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const onSubmit = async (data) => {
        const project = data.project;    
        const result = await window.api.createProject({project: project}) 
        if(props.projects){
            props.projects.push(JSON.parse(result))
        }
        props.handleClose()
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Create new Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="new-project-div">
                        <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3">
                                <Form.Label>Project Code</Form.Label>
                                <Form.Control 
                                    placeholder="Project Code"
                                    {...register('project.code')}
                                    type='text'
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Project Country</Form.Label>
                                <Form.Control 
                                    placeholder="Project Country"
                                    {...register('project.country')}
                                    type='text'
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control 
                                    {...register('project.notes')}
                                    placeholder="Notes (Optional)"
                                    type='text'
                                    as="textarea"
                                    rows={3}
                                />
                            </Form.Group>
                            <Button type='submit'>Create project</Button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}