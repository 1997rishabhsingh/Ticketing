import App from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/Header";
import { Container } from "reactstrap";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Container className="mt-2">
        <Component {...{ ...pageProps, currentUser }} />
      </Container>
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
