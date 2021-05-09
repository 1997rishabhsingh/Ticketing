import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  FormFeedback,
  Alert
} from "reactstrap";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios({
        url: "/api/users/signup",
        method: "POST",
        data: { email, password }
      });
    } catch (err) {
      const errs = err.response.data.errors.reduce(
        (acc, e) => ({ ...acc, [e.field]: e.message }),
        {}
      );
      setErrors(errs);
    }
  };

  return (
    <div>
      <h1>Sign Up!</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label id="email">Email Address</Label>
          <Input
            id="email"
            invalid={!!errors.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormFeedback>{errors.email}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label id="password">Password</Label>
          <Input
            id="password"
            type="password"
            invalid={!!errors.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormFeedback>{errors.password}</FormFeedback>
        </FormGroup>

        <Button color="primary" className="mt-3">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
