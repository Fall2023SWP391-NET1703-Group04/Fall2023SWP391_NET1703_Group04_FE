import React, { useEffect, useState } from 'react';
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

export default function AnimalDetail() {
    const { animalId } = useParams();
    const [animalData, setAnimalData] = useState({});
    const [updateAnimal, setUpdateAnimal] = useState({

    });
    const [selectedCatalogue, setSelectedCatalogue] = useState({});
    const [catalogues, setCatalogues] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [checked, setChecked] = useState();
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
        // Fetch animal data using the `animalId` parameter
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/animal/getAnimalById/${animalId}`, { headers: authHeader() })
            .then((response) => {
                setAnimalData(response.data.data);
            })
            .catch((error) => console.error(error));

        //catalogues
        axios.get('http://localhost:8080/zoo-server/api/v1/catalogue/getAllCatalogues', { headers: authHeader() })
            .then(response => {
                setCatalogues(response.data)
            })
            .catch(error => console.error(error));
    }, [animalId, refresh]);

    const header = (
        <img alt="Card" src={`http://localhost:3000/img/${animalData.image}`} />
    );

    const footer = (
        <>
            <Button label="Update" onClick={() => handleOpenUpdateAnimalModal(animalData)} icon="pi pi-pencil" />
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

    const handleSelectedChange = (event) => {
        console.log(event.target.value)
        setSelectedCatalogue(event.value);
        setUpdateAnimal({
            ...updateAnimal,
            catalogueId: event.target.value.catalogueId
        });
    }
    const handleSwitchChange = (event) => {
        setChecked(event.value)
        const { name, value } = event.target;
        setUpdateAnimal({
            ...updateAnimal,
            [name]: value
        });
    }

    const handleOpenUpdateAnimalModal = (animalData) => {
        setUpdateAnimal(animalData);
        setUpdateAnimal({
            ...updateAnimal,
            catalogueId: animalData.catalogueDTO.catalogueId
        });
        setChecked(animalData.rare);
        setSelectedCatalogue(animalData.catalogueDTO)
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
                console.error(error);
            });
    }
    return (
        <div className='grid ' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <div className="card col-4">
                <Fieldset legend={animalProfile} >
                    <Card title={animalData.animalName} subTitle={animalData.catalogueDTO?.catalogueName} footer={footer} header={header}>
                    </Card>
                </Fieldset>
            </div>
            <div className='col-1'></div>
            <div className="col-6  ml-3">
                <div className='card'>
                    <Fieldset legend={training} toggleable collapsed>
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
                        {/* <FileUpload mode="basic" name="image" accept="image/*" maxFileSize={1000000} onUpload={onUpload} /> */}
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
                            onChange={handleSelectedChange}
                            options={catalogues}
                            name='catalogueId'
                            optionLabel='catalogueName'
                            placeholder="Select a Catalogue"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="country">Country</label>

                        <br />
                        <InputText
                            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            id="country"
                            name="country"
                            value={updateAnimal.country}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="gender">Gender</label>
                        <br />
                        <InputText
                            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            id="gender"
                            name="gender"
                            value={updateAnimal.gender}
                            onChange={handleInputChange}
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