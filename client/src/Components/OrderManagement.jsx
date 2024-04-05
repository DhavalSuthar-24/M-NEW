import { Modal, Table, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import * as XLSX from 'xlsx';

export default function OrderManagement() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderIdToManage, setOrderIdToManage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/order/getOrdersDetails`);
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchOrders();
    }
  }, [currentUser.isAdmin]);

  const handleManageOrder = (orderId) => {
    setShowModal(true);
    setOrderIdToManage(orderId);
  };

  const handleAcceptOrder = async (orderIdToManage) => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/order/confirm/${orderIdToManage}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        // Update the orders after successful acceptance
        const updatedOrders = orders.map(order => {
          if (order._id === orderIdToManage) {
            order.orderConfirmation = true;
          }
          return order;
        });
        setOrders(updatedOrders);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCancelOrder = async (orderIdToManage) => {
    try {
      const res = await fetch(`/api/order/cancel/${orderIdToManage}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        // Update the orders after successful cancellation
        const updatedOrders = orders.map(order => {
          if (order._id === orderIdToManage) {
            order.orderConfirmation = false;
          }
          return order;
        });
        setOrders(updatedOrders);
        setShowModal(false); // Close the modal after canceling the order
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDownloadOrderSheet = () => {
    // Map the orders data to include additional fields
    const ordersData = orders.map(order => ({
      Order_ID: order._id,
      Order_Date: new Date(order.orderDate).toLocaleDateString(),
      Order_Confirmation: order.orderConfirmation ? 'CONFIRMED' : 'PENDING' ,
      Delivery_Status: order.deliveryStatus,
      Subtotal: `$${(order.subtotal / 100).toFixed(2)}`,
      Product_Title: order.products[0].title,
      Quantity: order.products[0].quantity,
      Category: order.products[0].category,
      User_ID: order.user,
    }));
  
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(ordersData);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  
    // Convert the workbook to a binary string
    const wbBinaryString = XLSX.write(workbook, { type: 'binary' });
  
    // Convert the binary string to a Blob
    const wbBlob = new Blob([s2ab(wbBinaryString)], { type: 'application/octet-stream' });
  
    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(wbBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  
  
  // Utility function to convert a string to an ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };
  

  return (
    <div className='max-w-full overflow-x-auto md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && orders.length > 0 ? (
        <>
          <Table hoverable className='shadow-md rounded-lg overflow-hidden text-xs'>
            <Table.Head className='bg-gray-200 dark:bg-gray-700 border border-gray-300'>
              <Table.HeadCell>Order Date</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Product</Table.HeadCell>
              <Table.HeadCell>Product Category</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Subtotal</Table.HeadCell>
              <Table.HeadCell>Delivery Status</Table.HeadCell>
              <Table.HeadCell>Order Confirmation</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            {orders.map((order, index) => (
              <Table.Body key={index} className='divide-y'>
                <Table.Row className='bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 border border-gray-300'>
                  <Table.Cell>{new Date(order.orderDate).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{order.user}</Table.Cell>
                  <Table.Cell>{order.products[0].title}</Table.Cell>
                  <Table.Cell>{order.products[0].category}</Table.Cell>
                  <Table.Cell>{order.products[0].quantity}</Table.Cell>
                  <Table.Cell>$ { (order.subtotal/100).toFixed(2)}</Table.Cell>
                  <Table.Cell>{order.deliveryStatus}</Table.Cell>
                  <Table.Cell className={order.orderConfirmation ? 'font-semibold' : ''}>{order.orderConfirmation ? 'Confirmed' : 'Pending'}</Table.Cell>
               <Table.Cell > <Button onClick={()=>{handleManageOrder(order._id)}} className=''>Manage
               Order</Button></Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          <Button className='bg-green-400 px-3 mt-4' onClick={handleDownloadOrderSheet}>
            Download Order Sheet
          </Button>
        </>
      ) : (
        <p>No orders available!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to manage this order?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={() => handleCancelOrder(orderIdToManage)}>
                Cancel Order
              </Button>
              <Button color='success' onClick={() => handleAcceptOrder(orderIdToManage)}>
                Accept Order
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
