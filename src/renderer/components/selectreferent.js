import React from "react";
import { set, useForm } from "react-hook-form";

export default function SelectReferent(props) {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const onChangeRefName = (e) => {
        props.setRefName(e.target.value);
    }

    const onChangeRefEmail = (e) => {
        props.setRefEmail(e.target.value);
    }

    const onChangeRefMobile = (e) => {
        props.setRefMobile(e.target.value);
    }

    const onChangeRefRole = (e) => {
        props.setRefRole(e.target.value);
    }

    return (
        <div>
            <h3>Referent</h3>
            <form input="submit">
                <input
                    {...register('referent.name')}
                    value={props.refName}
                    type='text'
                    placeholder="Referent Name"
                    onChange={onChangeRefName}
                    onFocus={() => {
                        document.querySelector("#referents-div").style.display = "block";
                    }}
                    onBlur={() => {
                        document.querySelector("#referents-div").style.display = "none";
                    }}
                />
                <input
                    {...register('referent.email')}
                    value={props.refEmail}
                    type='text'
                    placeholder="Referent Email"
                    onChange={onChangeRefEmail}
                />
                <input
                    {...register('referent.mobile')}
                    value={props.refMobile}
                    type='text'
                    placeholder="Referent Mobile"
                    onChange={onChangeRefMobile}
                />
                <input
                    {...register('referent.role')}
                    value={props.refRole}
                    type='text'
                    placeholder="Referent Role"
                    onChange={onChangeRefRole}
                />
            </form>
            <div id="referents-div" style={{display: 'none'}}>
                <ul>
                    {
                        props.referents.map((referent) => {
                            return <li><a onMouseDown={() => {
                                props.onSelectReferent(referent);
                            }}>{referent.name}</a></li>
                        })
                    }
                </ul>
            </div>
        </div>
    );

}