import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Fieldset } from 'primereact/fieldset';
import "/node_modules/primeflex/primeflex.css"
import "./AnimalDetails.css";
import authHeader from '../../AuthHeader/AuthHeader';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import AnimalTrainingHistory from './AnimalTrainingHistory';
import AnimalDietHistory from './AnimalDietHistory';
import AnimalCageHistory from './AnimalCageHistory';
import { Countries } from "../../Data/Countries"
import { Gender } from '../../Data/Gender';
import { Toast } from 'primereact/toast';

export default function AnimalDetail() {
    const { animalId } = useParams();
    const [animalData, setAnimalData] = useState({});
    const [updateAnimal, setUpdateAnimal] = useState({});
    const [selectedCatalogue, setSelectedCatalogue] = useState({});
    const [selectedCountry, setSelectedCountry] = useState();
    const [selectedGender, setSelectedGender] = useState();
    const [catalogues, setCatalogues] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [checked, setChecked] = useState();
    const country = "";
    const toast = useRef(null);
    const defaultImage = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";

    const animalProfile = (
        <div className="flex align-items-center text-primary" >
            <span className="pi pi-user mr-2"></span>
            <span className="font-bold text-lg">Animal Details</span>
        </div>
    );
    const training = (
        <div className="flex align-items-center text-primary" >
            <span className="font-bold text-lg">Training History</span>
        </div>
    );
    const diet = (
        <div className="flex align-items-center text-primary">
            <span className="font-bold text-lg">Diet History</span>
        </div>
    );
    const cage = (
        <div className="flex align-items-center text-primary">
            <span className="font-bold text-lg">Cage History</span>
        </div>
    );

    useEffect(() => {
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/animal/getAnimalById/${animalId}`, { headers: authHeader() })
            .then((response) => {
                setAnimalData(response.data.data);
                setUpdateAnimal(response.data.data);
                //
                setSelectedCountry(response.data.data.country);
                setSelectedGender(response.data.data.gender);
                setRefresh(false)
            })
            .catch((error) => console.error(error));

        //catalogues
        axios.get('http://localhost:8080/zoo-server/api/v1/catalogue/getAllCatalogues', { headers: authHeader() })
            .then(response => {
                setCatalogues(response.data)
            })
            .catch(error => console.error(error));
    }, [animalId, refresh]);

    const header = () => {
        const imageUrl = `http://localhost:3000/img/${animalData.image}`;
        const fallbackImageUrl = defaultImage;

        return (
            <img
                src={imageUrl || fallbackImageUrl}
                alt="Animal"
                onError={(e) => {
                    e.target.src = fallbackImageUrl;
                }}
            />
        );
    };

    const footer = (
        <>
            <Button label="Update" onClick={() => handleOpenUpdateAnimalModal()} icon="pi pi-pencil" />
        </>
    );

    //update
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdateAnimal({
            ...updateAnimal,
            [name]: value
        });
    }

    const onUpload = (event) => {
        const name = event.target.name;
        setUpdateAnimal({
            ...updateAnimal,
            [name]: event.target.files[0].name
        });
    }

    const handleSelectedChange = (event, name) => {
        if (name === "catalogueId") {
            setSelectedCatalogue(event.value);
            setUpdateAnimal({
                ...updateAnimal,
                catalogueId: event.target.value.catalogueId
            });
        }
        else if (name === "country") {
            setSelectedCountry(event.value)
            setUpdateAnimal({
                ...updateAnimal,
                country: event.target.value.name
            })
        }
        else {
            setSelectedGender(event.value)
            setUpdateAnimal({
                ...updateAnimal,
                gender: event.target.value.name
            });
        }
    }

    const handleSwitchChange = (event) => {
        setChecked(event.value)
        const { name, value } = event.target;
        setUpdateAnimal({
            ...updateAnimal,
            [name]: value
        });
    }

    const handleOpenUpdateAnimalModal = () => {
        // setUpdateAnimal(animalData);
        setUpdateAnimal({
            ...updateAnimal,
            catalogueId: animalData.catalogueDTO.catalogueId,
        });
        setSelectedCatalogue(animalData.catalogueDTO);
        setSelectedCountry(animalData.country);
        setSelectedGender(animalData.gender);
        setIsUpdateModalOpen(true);
    }

    const handleUpdateAnimal = async () => {
        await axios
            .put(`http://localhost:8080/zoo-server/api/v1/animal/updateAnimal/${animalId}`, updateAnimal, { headers: authHeader() })
            .then((response) => {
                setRefresh(true)
                setIsUpdateModalOpen(false);
            })
            .catch((error) => {
                show(error.response.data.message, 'red');
                console.error(error);
            });
    }

    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };

    return (
        <div className='grid ' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <Toast ref={toast} />
            <div className="card col-4">
                <Fieldset legend={animalProfile} >
                    <Card title={animalData.animalName} subTitle={animalData.catalogueDTO?.catalogueName} footer={footer} header={header}>
                    </Card>
                </Fieldset>
            </div>
            <div className='col-1'></div>
            <div className="col-7">
                <div className='card'>
                    <Fieldset legend={training} toggleable >
                        {AnimalTrainingHistory(animalId)}
                    </Fieldset>
                </div>
                <div className=' card mt-3'>
                    <Fieldset legend={diet} toggleable collapsed>
                        {AnimalDietHistory(animalId)}
                    </Fieldset>
                </div>
                <div className=' card mt-3'>
                    <Fieldset legend={cage} toggleable collapsed>
                        {AnimalCageHistory(animalId)}
                    </Fieldset>
                </div>
            </div>

            {/* Update animal */}
            <Dialog
                header="Update Animal"
                visible={isUpdateModalOpen}
                style={{ width: '800px' }}
                modal
                onHide={() => setIsUpdateModalOpen(false)}
            >
                <div class="formgrid grid">
                    <div className="field col-12">
                        <label htmlFor="updateAnimalImage">Animal Image</label>
                        <br />
                        <input
                            type="file"
                            accept="image/*"
                            name="image"
                            id="image"
                            onChange={onUpload}
                        />
                    </div>

                    <div className="field col-12 ">
                        <label htmlFor="animalName">Animal Name</label>
                        <InputText
                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            id="animalName"
                            name="animalName"
                            value={updateAnimal.animalName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="updateCatalogue">Catalogue Name</label>
                        <br />
                        <Dropdown
                            className="w-full "
                            value={selectedCatalogue}
                            onChange={(e) => handleSelectedChange(e, 'catalogueId')}
                            options={catalogues}
                            name='catalogueId'
                            optionLabel='catalogueName'
                            placeholder="Select a Catalogue"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="country">Country</label>
                        <br />
                        <Dropdown
                            className="w-full"
                            value={selectedCountry}
                            onChange={(e) => handleSelectedChange(e, 'country')}
                            name="country"
                            options={Countries} optionLabel="name"
                            placeholder="Select a Country"
                            filter
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="gender">Gender</label>
                        <br />
                        <Dropdown
                            value={selectedGender}
                            onChange={(e) => handleSelectedChange(e, 'gender')}
                            name="gender"
                            options={Gender} optionLabel="name"
                            placeholder="Select a Gender"
                            filter className="w-full"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="updateAnimalRare">Rare</label>
                        <br />
                        <InputSwitch
                            checked={checked}
                            name='rare'
                            onChange={handleSwitchChange} />
                    </div>

                    <Button
                        label="Update Animal"
                        icon="pi pi-pencil"
                        onClick={handleUpdateAnimal}
                        className="p-button-primary"
                    />
                </div>
            </Dialog>
        </div>
    )
}