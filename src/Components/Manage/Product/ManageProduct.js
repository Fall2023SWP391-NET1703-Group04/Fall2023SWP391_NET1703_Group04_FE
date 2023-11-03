
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import authHeader from '../../AuthHeader/AuthHeader';
import axios from 'axios';
export default function ManageProduct() {

  const [products4, setProducts4] = useState(null);
  const [editingRows, setEditingRows] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [first, setFirst] = useState(0); // Số thứ tự hàng đầu tiên của trang
  const [rows, setRows] = useState(10); // Số hàng trên mỗi trang
  const [newProduct, setNewProduct] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer3, setSelectedCustomer3] = useState(null);
  const [refresh, setRefresh] = useState(false);
  // Rest of your code

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };


  const toast = useRef(null);


  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'productName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

  });



  const [productLists, setProductLists] = useState([]);
  const apiUrl = `http://localhost:8080/zoo-server/api/v1/product/getAllProduct`;
  useEffect(() => {

    axios.get(apiUrl, { headers: authHeader() })
      .then(response => {

        setProductLists(response.data.data);
        setProducts4(response.data.data);
      })
      .catch(error => {
        console.error('Lỗi khi gửi yêu cầu:', error);
      });

  }, []);


  const actionBodyTemplate = (rowData) => {
    return (
      <div>

        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => deleteProduct(rowData)}
        />
        <Button
          icon="pi pi-eye"
          className="p-button-info"
          onClick={() => window.location.href = `product-details/${rowData.productId}`}
        />
      </div>
    );
  };




  const deleteProduct = (product) => {
    axios
      .delete(`http://localhost:8080/zoo-server/api/v1/product/deleteProduct/${product.productId}`, { headers: authHeader() })
      .then((response) => {
        // Xóa thành công, cập nhật danh sách sản phẩm ở phía client
        const updatedProductList = productLists.filter((item) => item.productId !== product.productId);
        setProductLists(updatedProductList);

        alert(response.data.message);
      })
      .catch((error) => {
        console.error('Lỗi khi xóa sản phẩm:', error);
      });
  };
  const show = (message, color) => {
    toast.current.show({
      summary: 'Notifications', detail: message, life: 3000,
      style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
    });
  };

  const handleAddProduct = () => {
    axios
      .post("http://localhost:8080/zoo-server/api/v1/product/createProduct", newProduct, { headers: authHeader() })
      .then((response) => {
        show(response.data.message, 'green');
        setNewProduct([])
        setIsModalOpen(false);
        setRefresh(true)
      })
      .catch((error) => {
        show(error.response.data.message, 'red');
        console.error(error);
      });
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  }
  const onUpload = (event) => {
    const name = event.target.name;
    setNewProduct({
      ...newProduct,
      [name]: event.target.files[0].name
    });
  }
  const handleInputChangequantity = (event) => {
    const { name, value } = event.target;

    // Ensure that the input is a positive integer
    const newValue = value.replace(/\D/g, ''); // Remove non-digit characters
    setNewProduct({
      ...newProduct,
      [name]: newValue,
    });
  };
  const handleInputChangePrice = (event) => {
    const { name, value } = event.target;

    // Ensure that the input is a non-negative number
    if (/^\d*\.?\d*$/.test(value)) {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };

  const filtersMap = {

    'filters': { value: filters, callback: setFilters },
  };


  const renderHeader = (filtersKey) => {
    const filters = filtersMap[`${filtersKey}`].value;
    const value = filters['global'] ? filters['global'].value : '';

    return (
      <div class="grid">
        <div class="col-4">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder="Product Name Search" />
          </span>
        </div>
        <div className='col-6'></div>
        <div class="col">
          <span>
            <Button
              label="Add Product"
              icon="pi pi-pencil"
              onClick={() => setIsModalOpen(true)}
              className="p-button-primary p-button-sm"
            />
          </span>
        </div>
      </div>
    );
  }


  const onGlobalFilterChange = (event, filtersKey) => {
    const value = event.target.value;
    let filters = { ...filtersMap[filtersKey].value };
    filters['global'].value = value;

    filtersMap[filtersKey].callback(filters);
  }

  const header3 = renderHeader('filters');
  const onCustomSaveState = (state) => {
    sessionStorage.setItem('dt-state-demo-custom', JSON.stringify(state));
  }
  const onCustomRestoreState = () => {
    return JSON.parse(sessionStorage.getItem('dt-state-demo-custom'));
  }

  const visibleProductLists = productLists.slice(first, first + rows);

  return (
    <div className="datatable-editing-demo">
      <Toast ref={toast} />
      <div className="card container ">
        <h5>List Product</h5>
        <DataTable value={productLists} paginator rows={10} header={header3} filters={filters} onFilter={(e) => setFilters(e.filters)}
          selection={selectedCustomer3} onSelectionChange={e => setSelectedCustomer3(e.value)} selectionMode="single" dataKey="id" responsiveLayout="scroll"
          stateStorage="custom" customSaveState={onCustomSaveState} customRestoreState={onCustomRestoreState} emptyMessage="No Product name found.">
          <Column field="productId" header="ID" style={{ width: '10%' }}></Column>
          <Column field="productName" header="Product Name" sortable style={{ width: '20%', textAlign: 'center' }}></Column>
          <Column field="description" header="Description" sortable style={{ width: '25%' }}></Column>
          <Column field="price" header="Price" sortable style={{ width: '15%' }}></Column>
          <Column field="quantity" header="Quantity" sortable style={{ width: '10%', textAlign: 'center' }}></Column>
          <Column field="Actions" header="Actions" style={{ width: '15%' }} body={actionBodyTemplate}></Column>
        </DataTable>



        <Dialog
          header="Add Product"
          visible={isModalOpen}
          style={{ width: '800px' }}
          modal
          onHide={() => setIsModalOpen(false)}
        >
          <div class="formgrid grid">
            <div className="field col-12 ">
              <label htmlFor="productName">Product Name</label>
              <br />
              <InputText
                id="productName"
                name="productName"
                value={newProduct.productName}
                onChange={handleInputChange}
              />
            </div>

            <div className="field col-12">
              <label htmlFor="updateDescription">Description</label>
              <br />
              <InputTextarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="field col-12 ">
              <label htmlFor="price">Price</label>
              <br />
              <InputText
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handleInputChangePrice}
              />
            </div>

            <div className="field col-12 ">
              <label htmlFor="quantity">Quantity</label>
              <br />
              <InputText
                id="quantity"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleInputChangequantity}
              />
            </div>
            <div className="field col-12 ">
              <div className="field col-12">
                <label htmlFor="image">Product Image</label>
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


            <Button
              label="Add Product"
              icon="pi pi-pencil"
              onClick={handleAddProduct}
              className="p-button-primary"
            />
          </div>
        </Dialog >
      </div>
    </div>
  );
}