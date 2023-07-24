/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import superjson from "superjson";
import { match, P } from "ts-pattern";
import { createServerSideHelpers } from "@trpc/react-query/server";
import Layout from "~/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
    },
    transformer: superjson,
  });

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

  useEffect(() => {
    match(getRedirectURLQuery)
      .with(
        { error: P.not(null) },
        (query) =>
          void router.push(
            new URL(
              `/404?message=${encodeURIComponent(query.error.message)}`,
              env.NEXT_PUBLIC_API_URL
            )
          )
      )
      .with(
        { data: P.not(undefined) },
        (query) =>
          void incrementClicksMutation
            .mutateAsync({ source })
            .then(() => router.push(new URL(query.data)))
      );
  }, [getRedirectURLQuery.data]);

  // TODO: Make loading page if necessary

  return <Layout title="Redirecting . . ." />;
}
