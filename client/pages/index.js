import { Button, Table } from "reactstrap";
import Link from "next/link";
import Router from "next/router";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser, tickets }) => {
  if (!currentUser) {
    return <h1>You are not signed in</h1>;
  }
  return (
    <>
      <h1>Available Tickets</h1>
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, i) => (
            <tr key={t.id}>
              <th scope="row">{i + 1}</th>
              <td>{t.title}</td>
              <td>₹ {t.price}</td>
              <td>
                <Button
                  color="primary"
                  size="sm"
                  outline
                  onClick={() => {
                    Router.push(`/tickets/${t.id}`);
                  }}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

LandingPage.getInitialProps = async (ctx) => {
  const { data } = await buildClient(ctx).get("/api/tickets");

  return { tickets: data };
};

export default LandingPage;
