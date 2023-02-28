import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { Form, InputGroup, Row, Col, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import AddAssociationModal from "./addassociationmodal";
import AddLocationModal from "./addlocationmodal";

export default function AddPersonPage() {
    const { control, register, handleSubmit, formState: { errors }, setValue } = useForm({ reValidateMode: 'onChange' });

    const navigate = useNavigate();

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: "person.family_members", // unique name for your Field Array
    });

    const [associationResults, setAssociationResults] = useState([])
    const [associationName, setAssociationName] = useState("")
    const [selectedAssociation, setSelectedAssociation] = useState(null)
    const [locations, setLocations] = useState([])
    const [locationCountry, setLocationCountry] = useState("")
    const [locationCity, setLocationCity] = useState("")
    const [locationAddress, setLocationAddress] = useState("")
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [referents, setReferents] = useState([])
    const [referentName, setReferentName] = useState("")
    const [referentRole, setReferentRole] = useState("")
    const [referentMobile, setReferentMobile] = useState("")
    const [selectedReferent, setSelectedReferent] = useState(null)
    const [familyChecboxChecked, setFamilyChecboxChecked] = useState(false);

    const [showAssociationModal, setShowAssociationModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const handleCloseAssociationModal = () => setShowAssociationModal(false);
    const handleShowAssociationModal = () => setShowAssociationModal(true);
    const handleCloseLocationModal = () => setShowLocationModal(false);
    const handleShowLocationModal = () => setShowLocationModal(true);

    const removeEmptyFields = (data) => {
        Object.keys(data).forEach(key => {
            if (data[key] === "" || data[key] == null) {
                delete data[key];
            }
        });
    }

    const onSubmit = async (data) => {
        const person = data.person;    
        removeEmptyFields(person);
        const result = await window.api.insertPerson({person: person}) 
        result !== null ? navigate('/person/' + JSON.parse(result).id) : null
    }

    const onChangeFamilyCheckbox = (e) => {
        setFamilyChecboxChecked(!familyChecboxChecked);
        if(fields.length == 0) append({});
    }

    const onChangeAssociationName = async (e) => {
        setSelectedAssociation(null)
        setAssociationName(e.target.value);
        if(e.target.value.length > 2){
            document.querySelector("#association-results-div").style.display = 'block';
            const result = await window.api.searchAssociation({searchText: e.target.value})
            result !== null ? setAssociationResults(result) : null;
        } else if(e.target.value.length == 0){
            setAssociationResults([])
        }
    }
    
    const selectAssociation = async (association) => {
        setAssociationName(association.name)
        document.querySelector("#association-results-div").style.display = 'none';
        const result = await window.api.getAssociation({associationId: association.id})
        const parsedResult = JSON.parse(result);
        setLocations(parsedResult.locations);
        setSelectedAssociation(parsedResult.id)
    }

    const selectLocationCountry = (selectedCountry) => {
        setLocationCountry(selectedCountry);
        setLocationCity("");
        setLocationAddress("");
    }

    const selectLocationCity = (selectedCity) => {
        setLocationCity(selectedCity);
        setLocationAddress("");
    }

    const selectLocation = async (selectedLocation) => {
        setSelectedLocation(selectedLocation)
    }

    const filterLocationCountries = (locations) => {
        const distinctCountries = [...new Set(locations.map(location => location.country))];
        return distinctCountries;
    }

    const filterLocationCities = (locations) => {
        const distinctCities = [...new Set(locations.filter(location => location.country === locationCountry).map(location => location.city))];
        return distinctCities;
    }

    const filterLocationAddresses = (locations) => {
        const addresses = [...new Set(locations.filter(location => location.country === locationCountry && location.city === locationCity))];
        return addresses;
    }


    return (
        <div>
            <h1>Add Person</h1>
            <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Form.Group className="mb-3">
                        <Form.Label>Association Name</Form.Label>
                        <Row>
                            <Col xs={11} sm={11} md={11} style={{paddingRight: '0px'}}>
                                <Form.Control 
                                    required
                                    placeholder="Association Name"
                                    onChange={onChangeAssociationName}
                                    value={associationName}
                                    type='text'
                                />
                            </Col>
                            <Col xs={1} sm={1} md={1}>
                                <>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id='tooltip-top'>
                                                Add new association
                                            </Tooltip>
                                        }
                                    >
                                        <Button onClick={handleShowAssociationModal}>+</Button>
                                    </OverlayTrigger>
                                </>
                            </Col>
                        </Row>
                    </Form.Group>
                    <div id="association-results-div" style={{display: associationResults.length == 0 ? 'none' : 'block'}}>
                        <ul>
                            {associationResults.map((association) => {
                                return <li key={association.id}><a onClick={() => {selectAssociation(association)}}>{association.name}</a></li>
                            })}
                        </ul>
                    </div>
                </div>
                <div>
                    <Row>
                        <Col xs={11} sm={11} md={11} style={{paddingRight: '0px'}}>
                            <InputGroup>
                                <Form.Select defaultValue={""} onChange={(e) => selectLocationCountry(e.target.value)}>
                                    <option>Country</option>
                                    {
                                        filterLocationCountries(locations).map((location, idx) => {
                                            return (
                                                <option key={idx} value={location}>{location}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                                <Form.Select defaultValue={""} onChange={(e) => selectLocationCity(e.target.value)}>
                                    <option>City</option>
                                    {
                                        filterLocationCities(locations).map((location, idx) => {
                                            return (
                                                <option key={idx} value={location}>{location}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                                <Form.Select defaultValue={""} {...register('person.proposers.0.association_loc_id', {
                                    onChange: e => selectLocation(e.target.value),
                                    valueAsNumber: true,
                                    required: true
                                })}>
                                    <option value="">Address</option>
                                    {
                                        filterLocationAddresses(locations).map((location, idx) => {
                                            return (
                                                <option key={idx} value={location.id}>{location.address}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                            </InputGroup>
                        </Col>
                        <Col xs={1} sm={1} md={1}>
                            <>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id='tooltip-top'>
                                            Add new location
                                        </Tooltip>
                                    }
                                >
                                    <Button disabled={selectedAssociation == null} onClick={handleShowLocationModal}>+</Button>
                                </OverlayTrigger>
                            </>
                        </Col>
                    </Row>
                </div>
                <hr />
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            required
                            placeholder="Name"
                            {...register('person.name')}
                            type='text'
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                            required
                            placeholder="Surname"
                            {...register('person.surname')}
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control 
                        {...register('person.birth_date')}
                        type='date'
                    />
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                            placeholder="Mobile Number"
                            {...register('person.mobile_number')}
                            type='text'
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            placeholder="Email"
                            {...register('person.email')}
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Document type</Form.Label>
                        <Form.Select
                            {...register('person.document_type')}
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
                            placeholder="Document Number"
                            {...register('person.document_number')}
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control 
                            placeholder="Country"
                            {...register('person.country')}
                            type='text'
                        />
                        <Form.Control 
                            placeholder="City"
                            {...register('person.city')}
                            type='text'
                        />
                        <Form.Control 
                            placeholder="Address"
                            {...register('person.address')}
                            type='text'
                        />
                    </InputGroup>
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Religion</Form.Label>
                        <Form.Control 
                            placeholder="Religion"
                            {...register('person.religion')}
                            type='text'
                        />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Marital Status</Form.Label>
                        <Form.Control
                            placeholder="Marital Status"
                            {...register('person.marital_status')}
                            type='text'
                        />
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Diseases</Form.Label>
                    <Form.Control 
                        placeholder="Diseases"
                        {...register('person.diseases')}
                        type='text'
                    />
                </Form.Group>

                <Form.Check 
                    type="checkbox"
                    value={familyChecboxChecked}
                    label="Add family members"
                    onClick={onChangeFamilyCheckbox}
                />
                <div id="family-members-div" style={{display: familyChecboxChecked ? "block" : "none"}}>
                        {fields.map((item, index) => (
                            <InputGroup style={{marginTop: '5px'}} key={item.id}>
                                <Form.Control 
                                    {...register(`person.family_members.${index}.name`)}
                                    placeholder="Name"
                                    required
                                />
                                <Form.Control 
                                    {...register(`person.family_members.${index}.surname`)}
                                    placeholder="Surname"
                                    required
                                />
                                <Form.Control 
                                    {...register(`person.family_members.${index}.birth_date`)}
                                    placeholder="Date of Birth"
                                    type="date"
                                    required
                                />
                                <Form.Select
                                    {...register(`person.family_members.${index}.document_type`)}
                                    type='text'
                                >
                                    <option value="">Doc. type</option>
                                    <option value="CI">Identity Card</option>
                                    <option value="Passport">Passport</option>
                                </Form.Select>
                                <Form.Control 
                                    {...register(`person.family_members.${index}.document_number`)}
                                    placeholder="Doc. Number"
                                />  
                                <Button variant="outline-danger" onClick={() => remove(index)}>
                                    X
                                </Button>
                            </InputGroup>
                        ))}
                    <Button style={{marginTop: '10px'}} type="button" variant="primary" size="sm" onClick={() => append({})}>
                        Add another family member
                    </Button>
                </div>



                <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control 
                        placeholder="Notes"
                        {...register('person.notes')}
                        type='text'
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>
                {/* <button {...register('person.photo_uri')} disabled type="button">Add photo</button>
                <button {...register('person.fingerprint_uri')} disabled type="button">Add fingerprint</button> */}
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
                <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" size="lg">
                        Add person
                    </Button>
                    <Button type="button" variant="secondary" as={Link} to="/">
                        Back to home page
                    </Button>
                </div>
            </form>

            <br />

            <AddAssociationModal show={showAssociationModal} handleClose={handleCloseAssociationModal} />

            <AddLocationModal associationId={selectedAssociation} show={showLocationModal} handleClose={handleCloseLocationModal} locations={locations}/>
        </div>
    );
}