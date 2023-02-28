import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function TestForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const [testInput, setTestInput] = useState("")

    const onChangeInput = (e) => {
        setTestInput(e.target.value);
    }

    const onSubmit = async (e) => {
        //console.log(e.testInput);
        const input = e.testInput;
        const result = await window.api.testInvoke({testInput: input})
        result !== null ? console.log(result) : null
    }

    return (
        <div>
            <form input="submit" onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register('testInput')}
                    value={testInput}
                    type='text'
                    onChange={onChangeInput}
                />
                <button type='submit'>Submit</button>
            </form>
        </div>
    );

}