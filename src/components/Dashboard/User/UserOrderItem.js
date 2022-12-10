import React, { useState } from "react";
import classes from '../Admin/AddNewFood.module.css';


function UserOrderItem(props) {
  const orderedItems = props.items;
  const [report, setReport] = useState("");

  const submitHandler = async (submitData) => {
    console.log(submitData)
    
  await fetch(`http://localhost:8080/orders/update-order/${submitData}`, {
    method: 'PUT',
    body: JSON.stringify({
      refund: report,

    }),
    headers: {

      'Content-Type': 'application/json'
    },
  });
      console.log("Refunded")
};


  let loadedItems = [];

  for (const key in orderedItems) {
    loadedItems.push({
      id: orderedItems[key].itemId,
      name: orderedItems[key].itemName,
      price: orderedItems[key].itemPrice,
      quantity: orderedItems[key].itemQuantity,
      totalPrice: orderedItems[key].itemTotalPrice,
      orderId: orderedItems[key].orderId
    });
  }

  console.log(loadedItems);

  return (
    <section>
      {loadedItems.map((loadedItem) => (
          <React.Fragment key={loadedItem.id}>         
          <p>Name: {loadedItem.name}</p>
          <p>price: {loadedItem.price}</p>
          <p>quantity: {loadedItem.quantity}</p>
          <p>totalPrice: {loadedItem.totalPrice}</p>

          <div className={classes.control}>
          <label htmlFor="description">Describe Product Replacement Issue : </label>
          <textarea
            name=""
            id="description"
            cols="30"
            rows="10"
            max="500"
            onChange={event => setReport(event.target.value)}

          ></textarea>
        </div>
          <div className={classes.actions}>
          <button className={classes.submit} onClick={()=> submitHandler(loadedItem.orderId)} type="submit">
            Submit
          </button>
        </div>
          
        </React.Fragment>
      ))}
    </section>
  );
}

export default UserOrderItem;
