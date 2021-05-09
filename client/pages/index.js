import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return (
    <div>
      Landing
      <h5>Here</h5>
    </div>
  );
};

LandingPage.getInitialProps = async ({ req }) => {
  let config = {};

  if (typeof window === "undefined") {
    // When environment is server Domain format => http://SERVICENAME.NAMESPACE.svc.cluster.local
    config = {
      url:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      // Since nginx is configured for this host and on server things are different
      headers: req.headers
    };
  } else {
    config = {
      url: "/api/users/currentuser"
    };
  }

  config.method = "GET";

  const { data } = await axios(config);

  return data;
};

export default LandingPage;
