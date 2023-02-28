import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchAssociation from "./searchassociation";
import SelectLocation from "./selectlocation";
import SelectReferent from "./selectreferent";

export default function ProposerSelector() {
    
    const [associationId, setAssociationId] = useState("")
    const [associationName, setAssociationName] = useState("")
    const [associationType, setAssociationType] = useState("")
    
    const [locationId, setLocationId] = useState("")
    const [locationCountry, setLocationCountry] = useState("")
    const [locationCity, setLocationCity] = useState("")
    const [locationAddress, setLocationAddress] = useState("")
    
    const [referentId, setReferentId] = useState("")
    const [refName, setRefName] = useState("")
    const [refEmail, setRefEmail] = useState("")
    const [refMobile, setRefMobile] = useState("")
    const [refRole, setRefRole] = useState("")
    
    const [locations, setLocations] = useState([])
    const [referents, setReferents] = useState([])

    const onSelectAssociation = async (id) => {
        setAssociationId(id);
        const result = await window.api.getAssociationLocations({associationId: id});
        setLocations(result);
        if(result.length == 1){
            setLocationCountry(result[0].country);
            setLocationCity(result[0].city);
            setLocationAddress(result[0].address);
            onSelectLocation(result[0].id);
        } else {
            setLocationCountry("");
            setLocationCity("");
            setLocationAddress("");
            setRefName("");
            setRefEmail("");
            setRefMobile("");
            setRefRole("");
        }
    }

    const onSelectLocation = async (id) => {
        setLocationId(id);
        const result = await window.api.getLocationReferents({locationId: id});
        setReferents(result);
        if(result.length == 1){
            setRefName(result[0].name);
            setRefEmail(result[0].email);
            setRefMobile(result[0].mobile_number);
            setRefRole(result[0].role);
        } else {
            setRefName("");
            setRefEmail("");
            setRefMobile("");
            setRefRole("");
        }
    }

    const onSelectReferent = (referent) => {
        setReferentId(referent.id);
        setRefName(referent.name);
        setRefEmail(referent.email);
        setRefMobile(referent.mobile_number);
        setRefRole(referent.role);
    }

    return (
        <div>
            <h1>Proposer Selector</h1>
            <button><Link to="/">Back to homepage</Link></button>
            <hr />
            <SearchAssociation 
                onSelectAssociation={onSelectAssociation}
                associationName={associationName}
                setAssociationName={setAssociationName}
                associationType={associationType}
                setAssociationType={setAssociationType}
            />
            <SelectLocation 
                locations={locations}
                locationCountry={locationCountry}
                locationCity={locationCity}
                locationAddress={locationAddress}
                setLocationCountry={setLocationCountry}
                setLocationCity={setLocationCity}
                setLocationAddress={setLocationAddress}
                onSelectLocation={onSelectLocation}
            />
            <SelectReferent 
                referents={referents}
                onSelectReferent={onSelectReferent}
                refName={refName}
                refEmail={refEmail}
                refMobile={refMobile}
                refRole={refRole}
                setRefName={setRefName}
                setRefEmail={setRefEmail}
                setRefMobile={setRefMobile}
                setRefRole={setRefRole}
            />
        </div>
    );

}