import React, { useState } from "react";
import Router from "next/router";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  FormFeedback,
  Alert
} from "reactstrap";

import useRequest from "../../hooks/use-request";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    method: "POST",
    url: "/api/users/signin",
    onSuccess() {
      Router.push("/");
    }
  });

  const getFieldError = (field) =>
    errors?.find((e) => e.field === field)?.message;

  const getError = () => errors?.find((e) => !e.field)?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await doRequest({ email, password });
  };

  return (
    <div>
      <h1>Sign In!</h1>
      <Form onSubmit={handleSubmit}>
        {getError() && <Alert color="danger">{getError()}</Alert>}
        <FormGroup>
          <Label id="email">Email Address</Label>
          <Input
            id="email"
            invalid={!!getFieldError("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormFeedback>{getFieldError("email")}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label id="password">Password</Label>
          <Input
            id="password"
            type="password"
            invalid={!!getFieldError("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormFeedback>{getFieldError("password")}</FormFeedback>
        </FormGroup>

        <Button color="primary" className="mt-3">
          Sign In
        </Button>
      </Form>
    </div>
  );
};

export default Signin;
