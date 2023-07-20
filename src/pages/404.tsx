import type { NextPage } from "next";
import Layout from "~/layout";

// TODO: Make error page pretty

const ErrorPage: NextPage = () => (
  <Layout title="Error - Link Not Found">
    <div>
      <h1>Requested Link Not Found</h1>
    </div>
  </Layout>
);

export default ErrorPage;
