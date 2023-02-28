import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function SearchAssociation(props) {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const [results, setResults] = useState([])

    const onChangeName = async (e) => {
        props.setAssociationName(e.target.value);
        if(e.target.value.length > 2){
            document.querySelector("#results-div").style.display = 'block';
            const result = await window.api.searchAssociation({searchText: e.target.value})
            result !== null ? setResults(result) : null;
        } else if(e.target.value.length == 0){
            setResults([])
        }
    }

    const selectAssociation = (association) => {
        props.setAssociationName(association.name);
        props.setAssociationType(association.type);
        props.onSelectAssociation(association.id);
        document.querySelector("#results-div").style.display = 'none';
    }

    return (
        <div>
            <h1>Search Association</h1>
            <form input="submit">
                <input
                    {...register('association.name')}
                    value={props.associationName}
                    type='text'
                    placeholder="Insert association name"
                    onChange={onChangeName}
                />
                <input
                    {...register('association.type')}
                    value={props.associationType}
                    type='text'
                    placeholder="Type"
                />
            </form>
            <div id="results-div" style={{display: results.length == 0 ? 'none' : 'block'}}>
                <h3>Result list</h3>
                <ul>
                    {results.map((association) => {
                        return <li key={association.id}><a onClick={() => {selectAssociation(association)}}>{association.name}</a></li>
                    })}
                </ul>
            </div>
        </div>
    );

}