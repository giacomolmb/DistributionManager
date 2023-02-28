import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { ListGroup, Form, Row, Col, InputGroup, Button } from "react-bootstrap";

export default function AddInterventionPage() {
    const { control, register, handleSubmit, formState: { errors }, setValue } = useForm({ reValidateMode: 'onChange' });

    const navigate = useNavigate();

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: "intervention.materials", // unique name for your Field Array
    });

    const [person, setPerson] = useState({})

    const [projectResults, setProjectResults] = useState([]);
    const [projectCode, setProjectCode] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);

    const [materialsCheckboxChecked, setMaterialsCheckboxChecked] = useState(false);

    const params = useParams()

    useEffect(() => {
        async function fetchData(){
            const result = await window.api.findPersonById({id: params.id});
            setPerson(JSON.parse(result));
        }

        fetchData()
    }, [])

    const onChangeProjectCode = async (e) => {
        setSelectedProject(null)
        setProjectCode(e.target.value);
        if(e.target.value.length == 0){
            setProjectResults([])
        } else {
            document.querySelector("#project-results-div").style.display = 'block';
            const result = await window.api.searchProject({searchText: e.target.value})
            result !== null ? setProjectResults(JSON.parse(result)) : null;
        }
    }

    const selectProject = (project) => {
        setProjectCode(project.code)
        document.querySelector("#project-results-div").style.display = 'none';
        setSelectedProject(project.id)
        setValue('intervention.project_id', project.id);
    }

    const onSubmit = async (data) => {
        if(selectedProject !== null){
            document.querySelector("#project-code").classList.add('is-valid');
            const intervention = data.intervention;    
            const result = await window.api.addIntervention({intervention: intervention}) 
            result !== null ? navigate('/person/' + JSON.parse(result).person_id) : null
        } else {
            document.querySelector("#project-code").classList.add('is-invalid');
        }
    }

    const onChangeMaterialsCheckbox = (e) => {
        setMaterialsCheckboxChecked(!materialsCheckboxChecked);
        if(fields.length == 0) append({});
    }

    return (
        <div>
            <h1 className="display-4">Add Intervention</h1>
            <ListGroup variant="flush">
                <ListGroup.Item><b>Name:</b> {person.name}</ListGroup.Item>
                <ListGroup.Item><b>Surname:</b> {person.surname}</ListGroup.Item>
                {
                    person.document_number !== "" && person.document_number !== null ? 
                        <ListGroup.Item><b>Document:</b>{person.document_type} - {person.document_number}</ListGroup.Item>
                    : null
                }
            </ListGroup>

            <hr />

            <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('intervention.person_id')} value={params.id} />
                <Form.Group className="mb-3">
                    <Form.Label>Project Code</Form.Label>
                    <Form.Control 
                        id="project-code"
                        placeholder="Project Code"
                        type='text'
                        onChange={onChangeProjectCode}
                        value={projectCode}
                    />
                </Form.Group>
                <div id="project-results-div" style={{display: projectResults.length == 0 ? 'none' : 'block'}}>
                    <ul>
                        {projectResults.map((project) => {
                            return <li key={project.id}><a onClick={() => {selectProject(project)}}>{project.code} ({project.country})</a></li>
                        })}
                    </ul>
                </div>
                <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control 
                        {...register('intervention.date')}
                        placeholder="date"
                        type='date'
                        required
                    />
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Country</Form.Label>
                        <Form.Control 
                            placeholder="Country"
                            {...register('intervention.country')}
                            type='text'
                            required
                        />
                    </Form.Group>
                    
                    <Form.Group as={Col}>
                        <Form.Label>City</Form.Label>
                        <Form.Control 
                            placeholder="City"
                            {...register('intervention.city')}
                            type='text'
                            required
                        />
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control 
                        {...register('intervention.notes')}
                        type='text'
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>
                <Form.Check 
                    type="checkbox"
                    value={materialsCheckboxChecked}
                    label="Specify materials"
                    onClick={onChangeMaterialsCheckbox}
                    {...register('intervention.materials_specified')}
                />
                <div id="materials-div" style={{display: materialsCheckboxChecked ? "block" : "none"}}>
                        {fields.map((item, index) => (
                            <InputGroup style={{marginTop: '5px'}} key={item.id}>
                                <Form.Control 
                                    {...register(`intervention.materials.${index}.type`)}
                                    placeholder="Material type"
                                />
                                <Form.Control 
                                    {...register(`intervention.materials.${index}.qty`)}
                                    placeholder="Quantity"
                                />
                                <Form.Control 
                                    {...register(`intervention.materials.${index}.measure`)}
                                    placeholder="Unity of measure"
                                />  
                                <Button variant="outline-secondary" onClick={() => remove(index)}>
                                    Delete
                                </Button>
                            </InputGroup>
                        ))}
                    <div className="d-grid gap-2">
                        <Button style={{marginTop: '10px'}} type="button" variant="primary" size="sm" onClick={() => append({})}>
                            Add material
                        </Button>
                    </div>
                </div>

                <br />

                <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" size="lg">
                        Add intervention
                    </Button>
                    <Button type="button" variant="secondary" as={Link} to={`/person/${params.id}`}>
                        Back to person page
                    </Button>
                    <Button type="button" variant="secondary" as={Link} to="/">
                        Back to homepage
                    </Button>
                </div>
            </form>
            <br />
        </div>
    );
}