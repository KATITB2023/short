/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useToast } from "@chakra-ui/react";
import { createRedirectURLSchema } from "~/schema/url";
import { type RouterOutputs, api } from "~/utils/api";
import Layout from "~/layout";
import { env } from "~/env.mjs";

type FormValues = z.infer<typeof createRedirectURLSchema>;

export default function SubmitRedirectURL() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(createRedirectURLSchema),
    defaultValues: {
      source: "",
      destination: "",
    },
  });

  const createRedirectURLMutation = api.url.createRedirectURL.useMutation();
  const toast = useToast();
  const [result, setResult] = useState<
    RouterOutputs["url"]["createRedirectURL"] | null
  >(null);

  const onSubmit: SubmitHandler<FormValues> = async (data, event) => {
    try {
      event?.preventDefault();

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

      setResult(response);
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
    }
  };

  const onCopyButtonClick = () => {
    if (!result) return;

    void navigator.clipboard
      .writeText(encodeURI(`${env.NEXT_PUBLIC_API_URL}/${result.source}}`))
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

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast({
        title: "Success",
        description: "Redirect URL created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      reset(); // Reset if successful
    }
  }, [isSubmitSuccessful]);

  return (
    <Layout title="Create Redirect URL">
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <p>
              Source: {env.NEXT_PUBLIC_API_URL}/
              <input {...field} />
            </p>
          )}
        />
        <Controller
          name="destination"
          control={control}
          render={({ field }) => (
            <p>
              Destination: <input {...field} />
            </p>
          )}
        />
        <input type="submit" />
        {result && (
          <>
            <p role="banner">
              Shortened this URL:{" "}
              {encodeURI(`${env.NEXT_PUBLIC_API_URL}/${result.source}`)}
            </p>
            <p>To this URL: {result.destination}</p>
            <button onClick={onCopyButtonClick}>Click here to copy!</button>
          </>
        )}
      </form>
    </Layout>
  );
}
