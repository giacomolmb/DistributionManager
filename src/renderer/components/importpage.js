import React from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function ImportPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const onSubmit = async (data) => {
        const result = await window.api.importPersons({filename: data.filename[0].path}).then((result) => {
            const parsed = JSON.parse(result);
            document.querySelector("#alert-panel").style.display = "block";
            document.querySelector("#alert-panel").innerHTML = "Successfully imported " + parsed.length + " persons into the database."
            setTimeout(() => {
                document.querySelector("#alert-panel").style.display = "none";
                document.querySelector("#alert-panel").innerHTML = ""
            }, 10000);
        })
    }

    return (
        <div>
        {/* <div className="Hello">
            <img width="200" alt="icon" src={icon} />
        </div> */}
        <h1 className="display-1">Import Data</h1>
        <p>Import persons into the database from a .csv file in your computer.</p>
        <hr />
        <form input="submit" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Select file:</Form.Label>
                <Form.Control 
                    type="file" 
                    {...register('filename')}
                />
            </Form.Group>
            <Button type="submit">Import</Button>
            <Alert id="alert-panel" variant="success" style={{display: "none", marginTop: "15px"}}>Data imported.</Alert>
        </form>
        </div>
    );

}