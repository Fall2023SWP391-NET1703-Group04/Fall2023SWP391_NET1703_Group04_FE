
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useHistory } from 'react-router-dom';
import { Paginator } from 'primereact/paginator';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';

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
  const [refresh, setRefresh] = useState(false);
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


  const visibleProductLists = productLists.slice(first, first + rows);

  return (
    <div className="datatable-editing-demo">
      <Toast ref={toast} />
      <div className="card p-fluid">
        <h5>List Product</h5>
        <div className="add-product-button">
          <Button
            label="Add Product"
            icon="pi pi-pencil"
            onClick={() => setIsModalOpen(true)}
            className="p-button-primary p-button-sm"
          />
        </div>

        <DataTable value={visibleProductLists} editMode="cell" className="editable-cells-table" filterDisplay="row" responsiveLayout="scroll">
          {columns.map(({ field, header, body }) => (
            <Column key={field} field={field} header={header} style={{ width: '17%' }} body={body} sortable={field !== 'actions'} filter={field !== 'actions'} className="p-d-flex p-jc-center p-ai-center" />
          ))}
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
              <InputNumber
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="field col-12 ">
              <label htmlFor="quantity">Quantity</label>
              <br />
              <InputText
                id="quantity"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleInputChange}
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




        <Paginator
          first={first}
          rows={rows}
          totalRecords={productLists.length}
          onPageChange={(e) => {
            setFirst(e.first);
            setRows(e.rows);
          }}
        ></Paginator>




      </div>
    </div>
  );
}
