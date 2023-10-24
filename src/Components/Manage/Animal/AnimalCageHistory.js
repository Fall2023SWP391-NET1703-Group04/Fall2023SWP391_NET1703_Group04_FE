import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import authHeader from '../../AuthHeader/AuthHeader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ModalAssignCage from './ModalAssignCage';

const AnimalCageHistory = (animalId) => {
    const [cageData, setCageData] = useState([]);
    const [refresh, setRefresh] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const paginatorRight = <Button type="button" onClick={() => setIsModalOpen(true)} icon="pi pi-plus" text label='Add' />;

    //Get data
    useEffect(() => {
        // Fetch the list of diets from your API endpoint
        axios.get(`http://localhost:8080/zoo-server/api/v1/AnimalCageDetail/getAllByAnimal/${animalId}`, { headers: authHeader() })
            .then(response => {
                setCageData(response.data.data);
                setRefresh(false)
            })
            .catch(error => console.error(error));
    }, [refresh, animalId]);

    const handleClose = () => {
        setIsModalOpen(false)
        setRefresh(true)
    }
    return (
        <div className='container' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <div className="card">
                {ModalAssignCage(animalId, isModalOpen, handleClose)}
                <DataTable value={cageData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorRight={paginatorRight}>
                    <Column field="animalCageName" header="Cage Name" style={{ width: '16%' }}></Column>
                    <Column field="animalName" header="Animal" style={{ width: '16%' }}></Column>
                    <Column field="dateStart" header="Date Start" style={{ width: '16%' }}></Column>
                    <Column field="dateEnd" header="Date End" style={{ width: '16%' }}></Column>
                    <Column field="animalCageDetailName" header="Description" style={{ width: '16%' }}></Column>
                </DataTable>
            </div>
        </div>
    )
}

export default AnimalCageHistory