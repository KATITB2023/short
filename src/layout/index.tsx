import Head from "next/head";
import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export default function Layout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="URL Shortener for KAT ITB 2023" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box px={{ base: 7, lg: 12 }} py={5}>
          {children}
        </Box>
      </motion.div>
    </>
  );
}
