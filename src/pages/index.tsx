import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import {
  useToast,
  Flex,
  Image,
  Box,
  Heading,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import { createRedirectURLSchema } from "~/schema/url";
import { type RouterOutputs, api } from "~/utils/api";
import Layout from "~/layout";
import { env } from "~/env.mjs";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type FormValues = z.infer<typeof createRedirectURLSchema>;

export default function SubmitRedirectURL() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createRedirectURLSchema),
    defaultValues: {
      source: "",
      destination: "",
    },
  });

  const createRedirectURLMutation = api.url.createRedirectURL.useMutation();

  const [result, setResult] = useState<
    RouterOutputs["url"]["createRedirectURL"]
  >({
    source: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit: SubmitHandler<FormValues> = async (data, event) => {
    try {
      event?.preventDefault();

      setLoading(true);

      if (errors.source)
        toast({
          title: "Error",
          description: errors.source.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

      if (errors.destination)
        toast({
          title: "Error",
          description: errors.destination.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

      const response = await createRedirectURLMutation.mutateAsync(data);

      setResult(response); // Set result
      onOpen(); // Open modal
      reset(); // Reset form
    } catch (error) {
      if (!(error instanceof TRPCClientError)) throw error;

      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const onCopyButtonClick = () => {
    if (!result) return;

    void navigator.clipboard
      .writeText(encodeURI(`${env.NEXT_PUBLIC_API_URL}/${result.source}`))
      .then(() =>
        toast({
          title: "Success",
          description: "Copied to clipboard!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        })
      );
  };

  return (
    <Layout title="Create Redirect URL">
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
            URL Shortener
          </Heading>
          <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
            <VStack spacing={4} mt={5} color="white">
              <FormControl isInvalid={!!errors.source}>
                <FormLabel>Source</FormLabel>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <InputGroup>
                      <InputLeftAddon>
                        {env.NEXT_PUBLIC_API_URL}/
                      </InputLeftAddon>
                      <Input {...field} />
                    </InputGroup>
                  )}
                />
                {errors.source && (
                  <FormErrorMessage>{errors.source.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.destination}>
                <FormLabel>Destination</FormLabel>
                <Controller
                  name="destination"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                {errors.destination && (
                  <FormErrorMessage>
                    {errors.destination.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </VStack>
            <Flex justifyContent="center" mt={7}>
              <Button
                alignSelf="center"
                isLoading={loading}
                loadingText="Loading . . ."
                type="submit"
              >
                Shorten!
              </Button>
            </Flex>
          </form>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bgGradient="linear(to-br, navy.3, purple.1)">
              <ModalHeader color="white">
                URL Redirection Created Successfully!
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text color="white">Shortened URL:</Text>
                <Text color="white">
                  <Link
                    href={encodeURI(
                      `${env.NEXT_PUBLIC_API_URL}/${result.source}`
                    )}
                    isExternal
                  >
                    {encodeURI(`${env.NEXT_PUBLIC_API_URL}/${result.source}`)}{" "}
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onCopyButtonClick} mr={3}>
                  Click here to copy!
                </Button>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
    </Layout>
  );
}
