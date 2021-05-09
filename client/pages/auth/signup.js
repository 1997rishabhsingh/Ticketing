import React, { useState } from "react";
import { Form, FormGroup, Input, Button, Label } from "reactstrap";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios({
      url: "/api/users/signup",
      method: "POST",
      data: { email, password }
    });

    console.log(data);
  };

  return (
    <div>
      <h1>Sign Up!</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label id="email">Email Address</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label id="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button color="primary" className="mt-3">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
