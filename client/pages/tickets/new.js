import React, { useState } from "react";
import Router from "next/router";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  FormFeedback,
  Alert,
  Row,
  Col
} from "reactstrap";
import { onlyFloatNumber } from "../../utils/helpers";
import useRequest from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    method: "POST",
    url: "/api/tickets",
    onSuccess() {
      Router.push("/");
    }
  });

  const getFieldError = (field) =>
    errors?.find((e) => e.field === field)?.message;

  const getError = () => errors?.find((e) => !e.field)?.message;

  const formatPrice = (e) => {
    const value = parseFloat(e.target.value);

    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest({ title, price });
  };

  return (
    <Row>
      <Col md="6">
        <h1>Create a Ticket</h1>
        <Form onSubmit={handleSubmit}>
          {getError() && <Alert color="danger">{getError()}</Alert>}
          <FormGroup>
            <Label id="title">Title</Label>
            <Input
              id="title"
              invalid={!!getFieldError("title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormFeedback>{getFieldError("title")}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label id="price">Price</Label>
            <Input
              id="price"
              type="number"
              invalid={!!getFieldError("price")}
              value={price}
              onBlur={formatPrice}
              onChange={(e) => setPrice(onlyFloatNumber(e.target.value))}
            />
            <FormFeedback>{getFieldError("price")}</FormFeedback>
          </FormGroup>

          <Button color="primary" className="mt-3">
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default NewTicket;
