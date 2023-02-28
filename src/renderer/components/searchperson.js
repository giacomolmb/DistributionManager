import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { InputGroup, Form, Button, Table } from "react-bootstrap";

export default function SearchPerson() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const [input, setInput] = useState("")

    const [results, setResults] = useState([])

    const navigate = useNavigate()

    const onChangeInput = (e) => {
        setInput(e.target.value);
    }

    const handleRowClick = (id) => {
        useCallback(() => navigate('/person/' + id, {replace: true}), [navigate])
    }

    const onSubmit = async (e) => {
        const result = await window.api.searchPerson({searchText: input})
        result !== null ? setResults(result) : null;
    }

    return (
        <div>
            <h1>Search Person</h1>

            <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                <input type="submit" hidden/>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Recipient's username"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        {...register('input')}
                        value={input}
                        type='text'
                        placeholder="Insert name or document number"
                        onChange={onChangeInput}
                    />
                    <Button variant="outline-success" type="submit" id="button-addon2">
                        Search
                    </Button>
                </InputGroup>
            </form>
            <div style={{display: results.length == 0 ? 'none' : 'block'}}>
                <h6 className="display-6" style={{fontSize: '4vh'}}>Result list</h6>
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Birth date</th>
                            <th>Document</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            results.map((person, idx) => {
                                if(person.familiar_id == null){
                                    return (
                                        <tr key={idx}>
                                            <td><Link to={`/person/${person.id}`}>{person.full_name}</Link></td>
                                            <td>{person.birth_date}</td>
                                            <td>{person.document_type} - {person.document_number}</td>
                                        </tr>
                                    )
                                } else {
                                    return (
                                        <tr key={idx}>
                                            <td><Link to={`/person/${person.id}/${person.familiar_id}`}>{person.full_name}</Link></td>
                                            <td>{person.birth_date}</td>
                                            <td>{person.document_type} - {person.document_number}</td>
                                        </tr>
                                    )
                                }
                            })
                        }
                    </tbody>
                </Table>
                <ul>
                </ul>
            </div>
        </div>
    );

}