import buildClient from "../api/build-client";
import { Table } from "reactstrap";

const LandingPage = ({ currentUser, tickets }) => {
  console.log(tickets);
  // return currentUser ? (
  //   <h1>You are signed in</h1>
  // ) : (
  //   <h1>You are not signed in</h1>
  // );

  return (
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t, i) => (
          <tr key={t.id}>
            <th scope="row">{i + 1}</th>
            <td>{t.price}</td>
            <td>{t.price}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

LandingPage.getInitialProps = async (ctx) => {
  const { data } = await buildClient(ctx).get("/api/tickets");

  return { tickets: data };
};

export default LandingPage;
