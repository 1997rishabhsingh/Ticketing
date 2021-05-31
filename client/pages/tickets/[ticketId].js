import React from "react";
import {
  Card,
  Button,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Alert
} from "reactstrap";
import Router from "next/router";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    method: "POST",
    url: "/api/orders",
    onSuccess(order) {
      Router.push(`/orders/${order.id}`);
    }
  });
  const getError = () => errors?.find((e) => !e.field)?.message;

  const handleButtonClick = () => {
    doRequest({ ticketId: ticket.id });
  };
  return (
    <Row>
      <Col md="4">
        {getError() && <Alert color="danger">{getError()}</Alert>}
        <Card>
          <CardHeader>Ticket Details</CardHeader>
          <CardBody>
            <CardTitle tag="h5">{ticket.title}</CardTitle>
            <CardText>₹ {ticket.price}</CardText>
            <Button color="primary" onClick={handleButtonClick}>
              Purchase
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

TicketShow.getInitialProps = async (ctx) => {
  const { ticketId } = ctx.query;

  const { data } = await buildClient(ctx).get(`/api/tickets/${ticketId}`);

  console.log(data);

  return { ticket: data };
};

export default TicketShow;
