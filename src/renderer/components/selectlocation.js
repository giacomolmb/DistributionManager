import React from "react";
import { set, useForm } from "react-hook-form";

export default function SelectLocation(props) {
    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const filterCountries = (locations) => {
        const distinctCountries = [...new Set(locations.map(location => location.country))];
        return distinctCountries;
    }

    const filterCities = (locations) => {
        const distinctCities = [...new Set(locations.filter(location => location.country === props.locationCountry).map(location => location.city))];
        return distinctCities;
    }

    const filterAddresses = (locations) => {
        const addresses = [...new Set(locations.filter(location => location.country === props.locationCountry && location.city === props.locationCity))];
        return addresses;
    }

    const selectCountry = (selectedCountry) => {
        props.setLocationCountry(selectedCountry);
        props.setLocationCity("");
        props.setLocationAddress("");
    }

    const selectCity = (selectedCity) => {
        props.setLocationCity(selectedCity);
        props.setLocationAddress("");
    }

    const selectAddress = (address) => {
        props.setLocationAddress(address);
    }

    const onChangeCountry = (e) => {
        props.setLocationCountry(e.target.value);
    }

    const onChangeCity = (e) => {
        props.setLocationCity(e.target.value);
    }

    const onChangeAddress = (e) => {
        props.setLocationAddress(e.target.value);
    }

    return (
        <div>
            <h3>Location</h3>
            <form input="submit">
                <input
                    {...register('location.country')}
                    value={props.locationCountry}
                    type='text'
                    placeholder="Country"
                    onChange={onChangeCountry}
                    onFocus={() => {
                        document.querySelector("#countries-div").style.display = "block";
                    }}
                    onBlur={() => {
                        document.querySelector("#countries-div").style.display = "none";
                    }}
                />
                <input
                    {...register('location.city')}
                    value={props.locationCity}
                    type='text'
                    placeholder="City"
                    onChange={onChangeCity}
                    onFocus={() => {
                        document.querySelector("#cities-div").style.display = "block";
                    }}
                    onBlur={() => {
                        document.querySelector("#cities-div").style.display = "none";
                    }}
                />
                <input
                    {...register('location.address')}
                    value={props.locationAddress}
                    type='text'
                    placeholder="Address"
                    onChange={onChangeAddress}
                    onFocus={() => {
                        document.querySelector("#addresses-div").style.display = "block";
                    }}
                    onBlur={() => {
                        document.querySelector("#addresses-div").style.display = "none";
                    }}
                />
            </form>
            <div id="countries-div" style={{display: 'none'}}>
                <ul>
                    {
                        filterCountries(props.locations).map((location) => {
                            return <li><a onMouseDown={() => {
                                selectCountry(location);
                            }}>{location}</a></li>
                        })
                    }
                </ul>
            </div>
            <div id="cities-div" style={{display: 'none'}}>
                <ul>
                    {
                        filterCities(props.locations).map((location) => {
                            return <li><a onMouseDown={() => {
                                selectCity(location);
                            }}>{location}</a></li>
                        })
                    }
                </ul>
            </div>
            <div id="addresses-div" style={{display: 'none'}}>
                <ul>
                    {
                        filterAddresses(props.locations).map((location) => {
                            return <li><a onMouseDown={() => {
                                selectAddress(location.address);
                                props.onSelectLocation(location.id)
                            }}>{location.address}</a></li>
                        })
                    }
                </ul>
            </div>
        </div>
    );

}