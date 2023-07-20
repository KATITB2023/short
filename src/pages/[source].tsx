/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import Layout from "~/layout";
import { createHelpers } from "~/server/api/trpc";
import { api } from "~/utils/api";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const helpers = createHelpers();

  const source =
    context.params?.source instanceof Array
      ? context.params?.source[0]
      : context.params?.source;

  if (!source)
    return {
      notFound: true,
    };

  await helpers.url.getRedirectURL.prefetch({ source });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      source,
    },
  };
}

export default function HashPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { source } = props;
  const getRedirectURLQuery = api.url.getRedirectURL.useQuery({ source });
  const incrementClicksMutation = api.url.incrementClicks.useMutation();
  const router = useRouter();

  const { data } = getRedirectURLQuery;

  useEffect(() => {
    if (!data) return;

    void incrementClicksMutation
      .mutateAsync({ source })
      .then(() => router.push(data));
  }, [data]);

  return <Layout title="Redirecting . . ." />;
}
