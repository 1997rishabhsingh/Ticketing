import React, { useEffect, useState } from "react";
import Router from "next/router";
import { Alert, Row, Col } from "reactstrap";
import StripeCheckout from "react-stripe-checkout";
import buildClient from "../../api/build-client";
import useInterval from "../../hooks/use-interval";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    method: "POST",
    url: "/api/payments",
    onSuccess(payment) {
      Router.push("/orders");
    }
  });

  useEffect(() => {
    const left = new Date(order.expiresAt) - new Date();
    setTimeLeft(Math.round(left / 1000));
  }, []);

  useInterval(
    () => {
      setTimeLeft(timeLeft - 1);
    },
    timeLeft >= 0 ? 1000 : null
  );

  const getError = () => errors?.find((e) => !e.field)?.message;

  if (timeLeft < 0) {
    return <div>Sorry the order is expired!</div>;
  }

  return (
    <div>
      <Row>
        <Col md="6">
          {getError() && <Alert color="danger">{getError()}</Alert>}
          <hr />
          Time left: {timeLeft}
          <br />
          <StripeCheckout
            token={({ id }) => doRequest({ orderId: order.id, token: id })}
            stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
            amount={order.ticket.price * 100}
            email={currentUser.email}
            currency="inr"
          />
        </Col>
      </Row>
    </div>
  );
};

OrderShow.getInitialProps = async (ctx) => {
  const { orderId } = ctx.query;

  const { data } = await buildClient(ctx).get(`/api/orders/${orderId}`);

  return { order: data };
};
export default OrderShow;
