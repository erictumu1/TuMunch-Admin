import axios from "axios";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { assets } from '../../assets/assets';
import './List.css';

const List = ({url}) => {

  const [list,setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if(response.data.success) {
      setList(response.data.data);
    }
    else{
      toast.error("Error")
    }
  }

  const removeFood = async(foodId) => {
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId})
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message)
    }
    else{
      toast.error("Error");
    }
  }

  useEffect(()=>{
    fetchList();
  },[])
  return (
    <div className="list add flex-col">
      <h2>Current Food Items</h2>
      <div className="list-table">
        <div className="list-table-format title">
        <b>Image</b>
        <b>Name</b>
        <b>category</b>
        <b>Price</b>
        <b>Action</b>
        </div>
      </div>
      {list.map((item,index)=>{
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <img onClick={() =>removeFood(item._id)} src={assets.delete_icon} alt="Delete" className="delete-icon" />
            </div>
          )
      })}
    </div>
  )
}

export default List