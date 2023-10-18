import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import authHeader from '../../AuthHeader/AuthHeader';
import { Navigate } from 'react-router-dom';
export default function ManageAnimal() {
    const [animals, setAnimals] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    //Get data
    useEffect(() => {
        // Fetch the list of diets from your API endpoint
        axios.get('http://localhost:8080/zoo-server/api/v1/animal/getAllAnimal', { headers: authHeader() })
            .then(response => setAnimals(response.data.data))
            .catch(error => console.error(error));
    }, [refresh]);

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
    return (
        <div className='container' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <div className="card">
                <DataTable value={animals} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                    <Column field="animalName" header="Name" style={{ width: '25%' }}></Column>
                    <Column field="catalogueDTO.catalogueName" header="Country" style={{ width: '25%' }}></Column>
                    <Column field="image" header="Image" style={{ width: '25%' }}></Column>
                    <Column field="country" header="Country" style={{ width: '25%' }}></Column>
                    <Column field="gender" header="Gender" style={{ width: '25%' }}></Column>
                    <Column
                        header="Actions"
                        style={{ width: '25%' }}
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
        </div>
    );
}