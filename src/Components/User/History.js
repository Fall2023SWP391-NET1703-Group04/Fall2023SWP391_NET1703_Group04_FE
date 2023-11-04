
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import authHeader from '../AuthHeader/AuthHeader';
import axios from 'axios';
import './History.css';

export default function History() {
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);
    const isMounted = useRef(false);
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.data?.userId;



    const apiUrl = `http://localhost:8080/zoo-server/api/v1/order/getBookingByAccount${currentUserId}`;

    useEffect(() => {

        axios.get(apiUrl, { headers: authHeader() })
            .then(response => {

                setProducts(response.data.data);

            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu:', error);
            });

    }, []);

    useEffect(() => {
        if (isMounted.current) {
            const summary = expandedRows !== null ? 'All Rows Expanded' : 'All Rows Collapsed';
            toast.current.show({ severity: 'success', summary: `${summary}`, life: 3000 });
        }
    }, [expandedRows]);


    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    }

    const expandAll = () => {
        let _expandedRows = {};
        products.forEach(p => _expandedRows[`${p.id}`] = true);

        setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    }

    const statusOrderBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
    }

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`images/product/${rowData.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />;
    }

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    }

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    }

    const allowExpansion = (rowData) => {
        return rowData.productDTOS.length > 0;
    };

    // list product
    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">

                <DataTable value={data.productDTOS} responsiveLayout="scroll">
                    <Column field="productId" header="Product Id" sortable></Column>
                    <Column field="productName" header="Product name" sortable></Column>
                    <Column field="productPrice" header="Product price" sortable></Column>
                    <Column field="bookingProductQuantity" header="quantity" sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    }

    const header = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="mr-2" />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
        </div>
    );
    return (
        <div className="datatable-rowexpansion-demo">
            <Toast ref={toast} />

            <div className="card">
                <DataTable value={products} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} responsiveLayout="scroll"
                    rowExpansionTemplate={rowExpansionTemplate} dataKey="id" header={header}>
                    <Column expander={allowExpansion} style={{ width: '3em' }} />
                    <Column field="fullName" header="Name" />expander={allowExpansion}
                    <Column field="totalPrice" header="total price" sortable />
                    <Column field="bookingDate" header="date order" sortable />
                    <Column field="status" header="Status" sortable />
                </DataTable>
            </div>
        </div>
    );
}
