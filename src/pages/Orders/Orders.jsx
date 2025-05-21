import axios from "axios";
import { useEffect, useRef, useState } from 'react';
import { toast } from "react-toastify";
import { assets } from "../../../../frontend/src/assets/assets";
import './Orders.css';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const ordersRef = useRef([]);

const fetchAllOrders = async (showNotification = false) => {
  try {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      const verifiedOrders = response.data.data.filter(order => order.payment === true);

      if (showNotification && verifiedOrders.length > ordersRef.current.length) {
        toast.info("New order received!", {
          className: "custom-toast",
        });
      }
      setOrders(verifiedOrders);
      ordersRef.current = verifiedOrders;
    } else {
      toast.error("Failed to fetch orders");
    }
  } catch (err) {
    toast.error("Server error");
  }
};
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const deleteOrderHandler = (orderId) => {
    const confirmDelete = async (closeToast) => {
      try {
        const response = await axios.delete(`${url}/api/order/delete/${orderId}`);
        if (response.data.success) {
          toast.success("Order deleted successfully", {
          style: { color: "black" }
        });
          await fetchAllOrders();
        } else {
          toast.error("Failed to delete order");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error");
      }
      closeToast();
    };

    toast.info(({ closeToast }) => (
      <div>
        <p className="p-color" >Are you sure you want to delete this order?</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <button
            onClick={() => confirmDelete(closeToast)}
            style={{
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Yes
          </button>
          <button
            onClick={closeToast}
            style={{
              backgroundColor: "#bdc3c7",
              color: "black",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            No
          </button>
        </div>
      </div>
    ), {
      autoClose: false,
      closeOnClick: false
    });
  };

  useEffect(() => {
    fetchAllOrders(false);
    const intervalId = setInterval(() => fetchAllOrders(true), 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='order-add'>
      <h3>Order Page</h3>

      {orders.length === 0 ? (
        <div className="empty-order-message">
          You have no orders at the moment
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-item" key={order._id}>
              <img src={assets.parcel_icon} alt="" />

              <div>
                <p className="order-item-food">
                  {order.items.map((item, itemIndex) => (
                    item.name + " x " + item.quantity + (itemIndex !== order.items.length - 1 ? ", " : "")
                  ))}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>${order.amount.toFixed(2)}</p>

              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>

              {order.status === "Delivered" && (
                <button
                  className="delete-btn"
                  onClick={() => deleteOrderHandler(order._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
