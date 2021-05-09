import { useState } from "react";
import axios from "axios";

function useRequest({ url, method, onSuccess }) {
  const [errors, setErrors] = useState(null);

  const doRequest = async (body) => {
    console.log({ method, url, body });
    try {
      const response = await axios({ method, url, data: body });

      setErrors(null);

      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log({ err });
      setErrors(err.response.data.errors);
    }
  };

  return { doRequest, errors };
}
export default useRequest;
