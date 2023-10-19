import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import authHeader from '../../AuthHeader/AuthHeader';
import ModalAssignDiet from './ModalAssignDiet';

export default function AnimalDietHistory(animalId) {
    const [dietData, setDietData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" onClick={() => setIsModalOpen(true)} icon="pi pi-plus" text label='Add' />;

    //Get data
    useEffect(() => {
        // Fetch the list of diets from your API endpoint
        axios.get(`http://localhost:8080/zoo-server/api/v1/animal-diet-management/getAllByAnimalId/${animalId}`, { headers: authHeader() })
            .then(response => {
                setDietData(response.data.data);
                setRefresh(false)
            })
            .catch(error => console.error(error));
    }, [animalId, refresh]);

    const handleClose = () => {
        setRefresh(true)
        setIsModalOpen(false)
    }

    return (
        <div className='container' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <div className="card">
                {ModalAssignDiet(animalId, isModalOpen, handleClose)}
                <DataTable value={dietData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                    <Column field="dietName" header="Diet Name" style={{ width: '16%' }}></Column>
                    <Column field="animalName" header="Animal" style={{ width: '16%' }}></Column>
                    <Column field="dateStart" header="Date Start" style={{ width: '16%' }}></Column>
                    <Column field="dateEnd" header="Date End" style={{ width: '16%' }}></Column>
                    <Column field="animalDietManagementName" header="Description" style={{ width: '16%' }}></Column>
                </DataTable>
            </div>
        </div>
    )
}
