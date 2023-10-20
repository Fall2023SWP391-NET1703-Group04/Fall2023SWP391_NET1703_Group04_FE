
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useHistory } from 'react-router-dom';

// import './DataTableDemo.css';
import authHeader from '../AuthHeader/AuthHeader';
import axios from 'axios';

export default function ManageProduct() {

  const [products4, setProducts4] = useState(null);
  const [editingRows, setEditingRows] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);

  // Rest of your code

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const toast = useRef(null);

  const columns = [
    { field: 'productId', header: 'productId', editable: false },
    { field: 'productName', header: 'productName' },
    { field: 'description', header: 'Description' },
    { field: 'quantity', header: 'Quantity' },
    { field: 'price', header: 'Price' },


  ];

  const statuses = [
    { label: 'In Stock', value: 'INSTOCK' },
    { label: 'Low Stock', value: 'LOWSTOCK' },
    { label: 'Out of Stock', value: 'OUTOFSTOCK' }
  ];

  const dataTableFuncMap = {
    'products4': setProducts4
  };



  const [productLists, setProductLists] = useState([]);
  const apiUrl = `http://localhost:8080/zoo-server/api/v1/product/getAllProduct`;
  useEffect(() => {

    axios.get(apiUrl, { headers: authHeader() })
      .then(response => {

        setProductLists(response.data.data);
        fetchProductData('products4');
      })
      .catch(error => {
        console.error('Lỗi khi gửi yêu cầu:', error);
      });

  }, []);
  console.log('checl list', productLists);

  const fetchProductData = (productStateKey) => {
    // Bạn có thể sử dụng dữ liệu từ productLists
    const data = productLists;
    dataTableFuncMap[productStateKey](data);
  }


  const isPositiveInteger = (val) => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'INSTOCK':
        return 'In Stock';

      case 'LOWSTOCK':
        return 'Low Stock';

      case 'OUTOFSTOCK':
        return 'Out of Stock';

      default:
        return 'NA';
    }
  }

  const productIdEditor = (props) => {
    return (
      <span>{props.rowData.productId}</span>
    );
  };


  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case 'quantity':
      case 'price':
        if (isPositiveInteger(newValue))
          rowData[field] = newValue;
        else
          event.preventDefault();
        break;

      default:
        if (typeof newValue === 'string' && newValue.trim().length > 0) { // Kiểm tra xem newValue có phải là chuỗi trước khi sử dụng trim
          rowData[field] = newValue;
        } else {
          event.preventDefault();
        }
        break;
    }
  }




  const cellEditor = (options) => {
    if (options.field === 'price')
      return priceEditor(options);
    else
      return textEditor(options);
  }

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  const priceEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />
  }


  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
  }


  const actionBodyTemplate = (rowData) => {
    return (
      <div>

        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => deleteProduct(rowData)}
        />
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info"
          onClick={() => window.location.href = `product-details/${rowData.productId}`}
        />
      </div>
    );
  };

  columns.push({
    field: 'actions',
    header: 'Actions',
    body: actionBodyTemplate,
    style: { textAlign: 'center', width: '10%', minWidth: '8rem' },
  });




  const deleteProduct = (product) => {
    axios.delete(`http://localhost:8080/zoo-server/api/v1/product/deleteProduct/${product.productId}`, { headers: authHeader() })
      .then((response) => {

        alert(response.data.message);


      })
      .catch((error) => {
        console.error('Lỗi khi xóa sản phẩm:', error);

      });
  };





  return (
    <div className="datatable-editing-demo">
      <Toast ref={toast} />
      <div className="card p-fluid">
        <h5>Cell Editing List Product</h5>
        {/* <DataTable value={productLists} editMode="cell" className="editable-cells-table" filterDisplay="row" responsiveLayout="scroll">
          {
            columns.map(({ field, header }) => {
              return <Column key={field} field={field} header={header} filter sortable style={{ width: '20%' }} body={field === 'price' && priceBodyTemplate}
              />
            })
          }              
        </DataTable> */}
        <DataTable value={productLists} editMode="cell" className="editable-cells-table" filterDisplay="row" responsiveLayout="scroll">
          {columns.map(({ field, header, body }) => (
            <Column key={field} field={field} header={header} style={{ width: '17%' }} body={body} sortable={field !== 'actions'} filter={field !== 'actions'} className="p-d-flex p-jc-center p-ai-center" />
          ))}
        </DataTable>






      </div>
    </div>
  );
}
