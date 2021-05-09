import App from "next/app";

import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header! {currentUser.email}</h1>
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const { data } = await buildClient(appContext.ctx).get(
    "/api/users/currentuser"
  );

  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, ...data };
};

export default AppComponent;
