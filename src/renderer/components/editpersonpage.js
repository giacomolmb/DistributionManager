import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";

export default function EditPersonPage() {
    const { register, handleSubmit, formState: { errors }} = useForm({ reValidateMode: 'onChange' });

    const navigate = useNavigate();

    const [personName, setPersonName] = useState("")
    const [personSurname, setPersonSurname] = useState("")
    const [personBirthDate, setPersonBirthDate] = useState("")
    const [personMaritalStatus, setPersonMaritalStatus] = useState("")
    const [personReligion, setPersonReligion] = useState("")
    const [personCountry, setPersonCountry] = useState("")
    const [personCity, setPersonCity] = useState("")
    const [personAddress, setPersonAddress] = useState("")
    const [personNotes, setPersonNotes] = useState("")
    const [personDiseases, setPersonDiseases] = useState("")
    const [personDocumentType, setPersonDocumentType] = useState("")
    const [personDocumentNumber, setPersonDocumentNumber] = useState("")
    const [personEmail, setPersonEmail] = useState("")
    const [personMobileNumber, setPersonMobileNumber] = useState("")

    const params = useParams()

    useEffect(() => {
        async function fetchData(){
            const result = await window.api.findPersonById({id: params.id});
            const person = JSON.parse(result)
            setPersonName(person.name)
            setPersonSurname(person.surname)
            setPersonBirthDate(person.birth_date)
            setPersonMaritalStatus(person.marital_status)
            setPersonReligion(person.religion)
            setPersonCountry(person.country)
            setPersonCity(person.city)
            setPersonAddress(person.address)
            setPersonNotes(person.notes)
            setPersonDiseases(person.diseases)
            setPersonDocumentNumber(person.document_number)
            setPersonDocumentType(person.document_type)
            setPersonEmail(person.email)
            setPersonMobileNumber(person.mobile_number)
        }

        fetchData()
    }, [])

    const removeEmptyFields = (data) => {
        Object.keys(data).forEach(key => {
            if (data[key] === "" || data[key] == null) {
                delete data[key];
            }
        });
    }
    
    const onSubmit = async (data) => {
        removeEmptyFields(data.person)
        const person = data.person
        const result = await window.api.updatePerson({person: person, id: data.id})
        result !== null ? navigate('/person/' + params.id) : null
    }

    return (
        <div>
            <h1>Edit Person</h1>
            <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} value={params.id}/>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            {...register('person.name')}
                            placeholder="Name"
                            value={personName}
                            onChange={(e) => {setPersonName(e.target.value)}}
                            type='text'
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                            {...register('person.surname')}
                            value={personSurname}
                            placeholder="Surname"
                            onChange={(e) => {setPersonSurname(e.target.value)}}
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control 
                        {...register('person.birth_date')}
                        value={personBirthDate}
                        onChange={(e) => {setPersonBirthDate(e.target.value)}}
                        required
                        type='date'
                    />
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                            {...register('person.mobile_number')}
                            placeholder="Mobile Number"
                            value={personMobileNumber}
                            onChange={(e) => {setPersonMobileNumber(e.target.value)}}
                            type='text'
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            {...register('person.email')}
                            placeholder="Email"
                            value={personEmail}
                            onChange={(e) => {setPersonEmail(e.target.value)}}
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Document type</Form.Label>
                        <Form.Select
                            {...register('person.document_type')}
                            onChange={(e) => {setPersonDocumentType(e.target.value)}}
                            value={personDocumentType}
                            type='text'
                        >
                            <option value="">Document type</option>
                            <option value="CI">National Identity Card</option>
                            <option value="Passport">Passport</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Document number</Form.Label>
                        <Form.Control 
                            {...register('person.document_number')}
                            placeholder="Document Number"
                            onChange={(e) => {setPersonDocumentNumber(e.target.value)}}
                            value={personDocumentNumber}
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control 
                            {...register('person.country')}
                            placeholder="Country"
                            onChange={(e) => {setPersonCountry(e.target.value)}}
                            value={personCountry}
                            type='text'
                        />
                        <Form.Control 
                            {...register('person.city')}
                            value={personCity}
                            onChange={(e) => {setPersonCity(e.target.value)}}
                            placeholder="City"
                            type='text'
                        />
                        <Form.Control 
                            {...register('person.address')}
                            value={personAddress}
                            onChange={(e) => {setPersonAddress(e.target.value)}}
                            placeholder="Address"
                            type='text'
                        />
                    </InputGroup>
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Religion</Form.Label>
                        <Form.Control 
                            {...register('person.religion')}
                            value={personReligion}
                            onChange={(e) => {setPersonReligion(e.target.value)}}
                            placeholder="Religion"
                            type='text'
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Marital Status</Form.Label>
                        <Form.Control
                            {...register('person.marital_status')}
                            value={personMaritalStatus}
                            onChange={(e) => {setPersonMaritalStatus(e.target.value)}}
                            placeholder="Marital Status"
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Diseases</Form.Label>
                    <Form.Control 
                        {...register('person.diseases')}
                        value={personDiseases}
                        onChange={(e) => {setPersonDiseases(e.target.value)}}
                        placeholder="Diseases"
                        type='text'
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control 
                        {...register('person.notes')}
                        value={personNotes}
                        onChange={(e) => {setPersonNotes(e.target.value)}}
                        placeholder="Notes"
                        type='text'
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>
                <Row>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button type="button" variant="secondary" disabled size="lg">
                                Add photo
                            </Button>
                        </div>
                    </Col>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button type="button" variant="secondary" disabled size="lg">
                                Add fingerprint
                            </Button>
                        </div>
                    </Col>
                </Row>
                <hr/>
                {/* <button {...register('person.photo_uri')} disabled type="button">Add photo</button>
                <button {...register('person.fingerprint_uri')} disabled type="button">Add fingerprint</button> */}
                <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" size="lg">
                        Save changes
                    </Button>
                    <Button type="button" variant="secondary" as={Link} to={"/person/" + params.id}>
                        Back to profile page
                    </Button>
                </div>
            </form>
            <br />
        </div>
    );
}