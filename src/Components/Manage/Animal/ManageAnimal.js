import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import authHeader from '../../AuthHeader/AuthHeader';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Link } from 'react-router-dom';

export default function ManageAnimal() {
    const [animals, setAnimals] = useState([]);
    const [newAnimal, setNewAnimal] = useState([])
    const [selectedCatalogue, setSelectedCatalogue] = useState({});
    const [catalogues, setCatalogues] = useState([])
    const [refresh, setRefresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checked, setChecked] = useState();
    const toast = useRef(null);

    //Add new animal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAnimal({
            ...newAnimal,
            [name]: value
        });
    }

    const handleSelectedChange = (event) => {
        setSelectedCatalogue(event.value);
        setNewAnimal({
            ...newAnimal,
            catalogueId: event.target.value.catalogueId
        });
    }

    const onUpload = (event) => {
        const name = event.target.name;
        setNewAnimal({
            ...newAnimal,
            [name]: event.target.files[0].name
        });
    }


    const handleSwitchChange = (event) => {
        setChecked(event.value)
        const { name, value } = event.target;
        setNewAnimal({
            ...newAnimal,
            [name]: value
        });
    }

    const handleAddAnimal = () => {
        axios
            .post("http://localhost:8080/zoo-server/api/v1/animal/createAnimal", newAnimal, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setNewAnimal([])
                setIsModalOpen(false);
                setRefresh(true)
            })
            .catch((error) => {
                show(error.response.data.message, 'red');
                console.error(error);
            });
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button label="Add" icon="pi pi-plus" onClick={handleOpenModal} />;

    //Get data
    useEffect(() => {
        // Fetch the list of diets from your API endpoint
        axios.get('http://localhost:8080/zoo-server/api/v1/animal/getAllAnimal', { headers: authHeader() })
            .then(response => {
                setAnimals(response.data.data)
                setRefresh(false)
            })
            .catch(error => console.error(error));

        axios.get(`http://localhost:8080/zoo-server/api/v1/catalogue/getAllCatalogues`, { headers: authHeader() })
            .then(response => setCatalogues(response.data))
            .catch(error => console.error(error));
    }, [refresh]);

    const imageBody = (rowData) => {
        return (
            <img
                src={`http://localhost:3000/img/${rowData.image}`} // Replace with the correct image URL property in your data
                alt="Animal"
                width="50"
                height="50"
            />
        );
    };

    //delete
    const handleDeleteAnimal = (animalId) => {
        axios
            .delete(`http://localhost:8080/zoo-server/api/v1/animal/deleteAnimal/${animalId}`, { headers: authHeader() })
            .then(() => {
                setRefresh(true)
            })
            .catch((error) => {
                console.error(error);
            });
    }
    const header = (
        <div>
            <h1>Animal Management</h1>
        </div>
    );

    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };
    return (
        <div className='container' style={{ width: "100%" }}>
            <Toast ref={toast} />
            <div className="card mt-5">
                <DataTable value={animals} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} header={header} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                    <Column field="animalName" header="Name" style={{ width: '15%' }}></Column>
                    <Column field="catalogueDTO.catalogueName" header="Catalogue" style={{ width: '15%' }}></Column>
                    <Column field="image" header="Image" style={{ width: '15%' }} body={imageBody}></Column>
                    <Column field="country" header="Country" style={{ width: '15%' }}></Column>
                    <Column field="gender" header="Gender" style={{ width: '15%' }}></Column>
                    <Column
                        header="Actions"
                        style={{ width: '15%' }}
                        body={(rowData) => (
                            <div>
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger"
                                    onClick={() => handleDeleteAnimal(rowData.animalId)}
                                />
                                <Button
                                    icon="pi pi-eye"
                                    className="p-button-rounded p-button-info"
                                    onClick={() => window.location.href = `animal-details/${rowData.animalId}`}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </div>
            <Dialog
                header="Add Animal"
                visible={isModalOpen}
                style={{ width: '800px' }}
                modal
                onHide={() => setIsModalOpen(false)}
            >
                <div class="formgrid grid">
                    <div className="field col-12 ">
                        <label htmlFor="animalName">Animal Name</label>
                        <br />
                        <InputText
                            id="animalName"
                            name="animalName"
                            value={newAnimal.animalName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="updateCatalogue">Catalogue</label>
                        <br />
                        <Dropdown
                            value={selectedCatalogue}
                            onChange={handleSelectedChange}
                            options={catalogues}
                            name='catalogueId'
                            optionLabel='catalogueName'
                            placeholder="Select a Catalogue"
                        />
                    </div>
                    <div className="field col-12 ">
                        <label htmlFor="country">Country</label>
                        <br />
                        <InputText
                            id="country"
                            name="country"
                            value={newAnimal.country}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field col-12 ">
                        <label htmlFor="gender">Gender</label>
                        <br />
                        <InputText
                            id="gender"
                            name="gender"
                            value={newAnimal.gender}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field col-12 ">
                        <div className="field col-12">
                            <label htmlFor="image">Animal Image</label>
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
                    </div>
                    <div className="field col-12">
                        <label htmlFor="updateAnimalRare">Rare</label>
                        <InputSwitch
                            className=" flex justify-content-center"
                            checked={checked}
                            name='rare'
                            onChange={handleSwitchChange} />
                    </div>

                    <Button
                        label="Add Animal"
                        icon="pi pi-pencil"
                        onClick={handleAddAnimal}
                        className="p-button-primary"

                    />
                </div>
            </Dialog >
        </div>


    );
}