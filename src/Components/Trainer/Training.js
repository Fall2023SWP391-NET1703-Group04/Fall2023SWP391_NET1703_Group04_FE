import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { InputText } from 'primereact/inputtext';

import axios from 'axios';
import authHeader from "../AuthHeader/AuthHeader";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Link } from 'react-router-dom';


export default function Training() {


    const [trainingList, setTrainingList] = useState([])
    const user = JSON.parse(localStorage.getItem('user'));
    const userID = user.data.userId;

    const [selectedCustomer3, setSelectedCustomer3] = useState(null);

    const apiUrl = `http://localhost:8080/zoo-server/api/v1/animal-management/getAllByTrainer/${userID}`;
    useEffect(() => {
        axios.get(apiUrl, { headers: authHeader() })
            .then(response => {
                setTrainingList(response.data.data);
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu:', error);
            });

    }, []);

    const [filters3, setFilters3] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'animalTrainingName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'representative': { value: null, matchMode: FilterMatchMode.IN },
        // 'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });
    const onCustomSaveState = (state) => {
        sessionStorage.setItem('dt-state-demo-custom', JSON.stringify(state));
    }
    const onCustomRestoreState = () => {
        return JSON.parse(sessionStorage.getItem('dt-state-demo-custom'));
    }


    const filtersMap = {

        'filters3': { value: filters3, callback: setFilters3 },
    };


    const onGlobalFilterChange = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters['global'].value = value;

        filtersMap[filtersKey].callback(filters);
    }

    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder="Traing Name Search" />
            </span>
        );
    }

    const header3 = renderHeader('filters3');



    return (
        <div>
            <div className="card">


                <div>
                    <h5> Training Animal Detail</h5>
                </div>
                <div className="flex flex-row-reverse flex-wrap ">
                    <div className="flex align-items-center justify-content-center w-3 rem  font-bold text-gray-900 border-round m-2">
                        <Link className='no-underline' to="/trainer">Trainer Detail</Link>
                    </div>

                </div>

                <div>
                    <DataTable value={trainingList} paginator rows={10} header={header3} filters={filters3} onFilter={(e) => setFilters3(e.filters)}
                        selection={selectedCustomer3} onSelectionChange={e => setSelectedCustomer3(e.value)} selectionMode="single" dataKey="id" responsiveLayout="scroll"
                        stateStorage="custom" customSaveState={onCustomSaveState} customRestoreState={onCustomRestoreState} emptyMessage="No training name found.">

                        <Column key="trainingId" field="animalTrainingId" header="Training ID" sortable></Column>
                        <Column field="animalTrainingName" header="Training Name" sortable filter filterPlaceholder="Search by animalTrainingName"></Column>
                        {/* <Column field="userId" header="User ID" sortable></Column> */}
                        <Column field="fullName" header="Trainer Name" sortable></Column>
                        <Column field="animalId" header="Animal ID" sortable></Column>
                        <Column field="animalName" header="Animal Name" sortable></Column>

                        <Column field="dateStart" header="Date Start" sortable></Column>
                        <Column field="dateEnd" header="Date End" sortable></Column>

                    </DataTable>

                </div>


            </div>
        </div>
    );
};


