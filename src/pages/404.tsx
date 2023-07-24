import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "~/layout";

const ErrorPage: NextPage = () => {
  const router = useRouter();

  const { message } = router.query;

  const displayMessage =
    (message instanceof Array ? message[0] : message) ?? "Unknown";

  return (
    <Layout title={`404 Error: ${displayMessage}`}>
      <Flex
        backgroundImage="/images/bg-coming-soon.png"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        minH="100vh"
        alignItems="center"
        justifyContent="center"
        position="relative"
        px={5}
      >
        <Image
          src="/images/spark.png"
          alt=""
          position="absolute"
          w="30%"
          top="0"
          left="0"
          zIndex="0"
          draggable="false"
          loading="lazy"
        />
        <Image
          src="/images/spark3.png"
          alt=""
          position="absolute"
          w="10%"
          bottom="10%"
          right="35%"
          zIndex="0"
          draggable="false"
          loading="lazy"
        />
        <Image
          src="/images/ornamen.png"
          alt=""
          position="absolute"
          w="30%"
          top="5%"
          right="0"
          zIndex="1"
          draggable="false"
          loading="lazy"
        />
        <Box
          zIndex="10"
          bgGradient="linear(to-br, navy.1, purple.3)"
          boxShadow="inset 0 0 24px rgba(0,0,0,0.8), 12px 12px rgba(0,0,0,0.4)"
          px={12}
          py={9}
          borderRadius="lg"
          color="yellow.3"
          maxH="70vh"
          overflowY="auto"
          w={{ base: "80%", lg: "700px" }}
        >
          <Heading
            fontSize="2xl"
            textAlign="center"
            textShadow="4px 6px rgba(0,0,0,0.5)"
          >
            404 Error: {displayMessage}
          </Heading>
        </Box>
      </Flex>
    </Layout>
  );
};

export default ErrorPage;
