import React from "react";
import { Button, Table } from "reactstrap";
import buildClient from "../../api/build-client";

const Orders = ({ orders }) => {
  return (
    <>
      <h1>My Orders</h1>
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id}>
              <th scope="row">{i + 1}</th>
              <td>{o.ticket.title}</td>
              <td>{`${o.status[0].toUpperCase()}${o.status.slice(1)}`}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

Orders.getInitialProps = async (ctx) => {
  const { data } = await buildClient(ctx).get("/api/orders");

  return { orders: data };
};

export default Orders;
