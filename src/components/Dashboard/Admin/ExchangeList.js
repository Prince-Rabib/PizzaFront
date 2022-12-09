import Card from '../../UI/Card';
import classes from './ExchangeList.module.css';
import Order from './Order';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth-slice';

const ExchangeList = () => {
  const dispatch = useDispatch();
  const stateAdminToken = useSelector((state) => state.auth.adminToken);
  const [orders, setOrders] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchOrdersHandler() {
      setIsError(null);
      setIsLoading(true);
      try {
        const response = await fetch(
          'http://localhost:8080/orders/fetch-orders',
          {
            headers: {
              Authorization: `Bearer ${stateAdminToken}`,
            },
          }
          
        );
        

        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        const data = await response.json();
        console.log(data);
        let loadedOrders = [];

        for (const key in data) {
          let loadedItems = [];
          for (const itemKey in data[key].orderData) {
            loadedItems.push({
              itemId: itemKey,
              itemName: data[key].orderData[itemKey].title,
              itemPrice: data[key].orderData[itemKey].price,
              itemQuantity: data[key].orderData[itemKey].quantity,
            });
          }

          // TODO: /admin order summary problem

          dispatch(
            authActions.calculateOrderSummary({
              totalQuantity: data[key].totalOrderedQuantity,
              totalPrice: data[key].totalOrderedPrice,
            })
          );

          if(data[key]?.refund) {
            loadedOrders.push({
              id: key,
              name: data[key].userData.name,
              city: data[key].userData.city,
              items: loadedItems,
              refund: data[key]?.refund
            });
          }
        }
        setOrders(loadedOrders);
      } catch (error) {
        setIsError(error.message);
      }
      setIsLoading(false);
    }
    fetchOrdersHandler();
  }, [dispatch, stateAdminToken]);

  const ordersList = orders.map((order) => (
    <Order
      key={order.id}
      id={order.id}
      name={order.name}
      city={order.city}
      items={order.items}
      refund={order?.refund}
    />
  ));

  let content = <p>Found no order.</p>;

  if (ordersList.length > 0) {
    content = ordersList;
  }

  if (isError) {
    content = <p>{isError}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <section className={classes.orders}>
      <Card>{content}</Card>
    </section>
  );
};

export default ExchangeList;
