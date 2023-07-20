import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "~/layout";

// TODO: Make error page pretty

const ErrorPage: NextPage = () => {
  const router = useRouter();

  const { message } = router.query;

  return (
    <Layout title={`Error: ${message}`}>
      <div>
        <h1>{message}</h1>
      </div>
    </Layout>
  );
};

export default ErrorPage;
