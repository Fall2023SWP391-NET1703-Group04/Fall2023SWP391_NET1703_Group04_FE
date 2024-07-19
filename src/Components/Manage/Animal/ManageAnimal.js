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
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Countries } from '../../Data/Countries';
import { Gender } from '../../Data/Gender';

export default function ManageAnimal() {
    const [animals, setAnimals] = useState([]);
    const [newAnimal, setNewAnimal] = useState([{
        "animalName": "",
        "catalogueId": null,
        "country": "",
        "gender": "",
        "image": ""
    }])
    const [selectedCatalogue, setSelectedCatalogue] = useState({});
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [catalogues, setCatalogues] = useState([])
    const [refresh, setRefresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checked, setChecked] = useState();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const defaultImage = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";
    //Search by animals name
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'animalName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

    });

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            animalName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button label="Add" icon="pi pi-plus" onClick={handleOpenModal} />
                <Button className='ml-auto' type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search by name" />
                </span>
            </div>
        );
    };

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

    const handleSelectedChange = (event, name) => {
        console.log(event, name);
        if (name === "catalogueId") {
            setSelectedCatalogue(event.value);
            setNewAnimal({
                ...newAnimal,
                catalogueId: event.target.value.catalogueId
            });
        }
        else if (name === "country") {
            setSelectedCountry(event.value)
            setNewAnimal({
                ...newAnimal,
                country: event.target.value.name
            });
        }
        else {
            setSelectedGender(event.value)
            setNewAnimal({
                ...newAnimal,
                gender: event.target.value.name
            });
        }

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
            .post("http://localhost:8080/api/v1/Animal/createAnimal", newAnimal, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setNewAnimal([])
                setIsModalOpen(false);
                setRefresh(true)
            })
            .catch((error) => {
                if (newAnimal.animalName === "") {
                    show("Please, input animal name", 'red');
                }
                else if (newAnimal.catalogueId === null) {
                    show("Please, choose catalogue", 'red');
                }
                else if (newAnimal.image === "") {
                    show(error.response.data.message, 'red');
                }
                else {
                    show(error.response.data.message, 'red');
                    // show("All empty :(", 'red');
                }
                console.error(error);
            });
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;

    //Get data
    useEffect(() => {
        // Fetch the list of diets from your API endpoint
        axios.get('http://localhost:8080/api/v1/Animal/all')
            .then(response => {
                console.log("con lay cu",response.data.animal)
                setAnimals(response.data.animal)
                setRefresh(false)
            })
            .catch(error => console.error(error));

        axios.get(`http://localhost:8080/api/v1/catalogue/getAllCatalogues`)

            .then(response => setCatalogues(response.data.catalogues))           
            .catch(error => console.error(error));
    }, [refresh]);

    const imageBody = (rowData) => {
        const imageUrl = `http://localhost:3000/img/${rowData.image}`;
        const fallbackImageUrl = defaultImage;

        return (
            <img
                src={imageUrl || fallbackImageUrl}
                alt="Animal"
                width="50"
                height="50"
                onError={(e) => {
                    e.target.src = fallbackImageUrl;
                }}
            />
        );
    };


    //delete
    const handleDeleteAnimal = (animalId) => {
        axios
            .delete(`http://localhost:8080/api/v1/Animal/deleteAnimal/${animalId}`, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setRefresh(true)
            })
            .catch((error) => {
                show(error.response.data.message, 'red');
                console.error(error);
            });
    }
    const header = renderHeader();

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
                <h1>List Animal</h1>
                <DataTable value={animals} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} header={header} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft}
                    filters={filters} onFilter={(e) => setFilters(e.filters)}>
                    <Column field="animalName" header="Name" style={{ width: '15%' }}></Column>
                    {/* <Column field="catalogueDTO.catalogueName" header="Catalogue" style={{ width: '15%' }}></Column> */}
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

            {/* Add animal */}
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
                            required
                            className='w-full'
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
                            onChange={(e) => handleSelectedChange(e, 'catalogueId')}
                            options={catalogues}
                            name='catalogueId'
                            optionLabel='catalogueName'
                            placeholder="Select a Catalogue"
                        />
                    </div>
                    <div className="field col-12 ">
                        <label htmlFor="country">Country</label>
                        <br />
                        <Dropdown
                            value={selectedCountry}
                            onChange={(e) => handleSelectedChange(e, 'country')}
                            name="country"
                            options={Countries} optionLabel="name"
                            placeholder="Select a Country"
                            filter className="w-full"
                        />
                    </div>
                    <div className="field col-12 ">
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
                    <div className="field col-12 ">
                        <label htmlFor="image">Animal Image</label>
                        <br />
                        <input
                            type="file"
                            accept="image/*"
                            name="image"
                            id="image"
                            onChange={onUpload}
                        />
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