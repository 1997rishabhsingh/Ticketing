import React, { useEffect } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const Signout = () => {
  const { doRequest } = useRequest({
    method: "POST",
    url: "/api/users/signout",
    body: {},
    onSuccess: () => Router.push("/")
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing you out...</div>;
};

export default Signout;
