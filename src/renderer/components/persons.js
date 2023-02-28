import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ListGroup, Button, Modal, Form, InputGroup } from "react-bootstrap";

export default function Persons() {
    const [projects, setProjects] = useState([]);
    const projectsTable = useMemo(() => projects, []);

    const fetchData = async () => {
        const result = await window.api.getProjects();
        setProjects(JSON.parse(result));
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="display-4">Persons</h1>
            <button type="button" onClick={() => console.log(projectsTable)}>click me!</button>
        </div>
    );
}