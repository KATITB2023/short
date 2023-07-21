import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "~/layout";
import { createRedirectURLSchema } from "~/schema/url";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { TRPCClientError } from "@trpc/client";

// TODO: Make form page pretty

type FormValues = z.infer<typeof createRedirectURLSchema>;

export default function SubmitRedirecURL() {
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await createRedirectURLMutation.mutateAsync(data);
    } catch (error) {
      if (!(error instanceof TRPCClientError)) throw error;

      alert(error.message); // TODO: Change error display to toast
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) reset(); // Reset if successful
  }, [isSubmitSuccessful]);

  return (
    <Layout title="Create Redirect URL">
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <Controller
          name="source"
          control={control}
          render={({ field }) => <input {...field} />}
        />
        <Controller
          name="destination"
          control={control}
          render={({ field }) => <input {...field} />}
        />
        {errors.source && <p role="alert">{errors.source.message}</p>}
        {errors.destination && <p role="alert">{errors.destination.message}</p>}
        <input type="submit" />
      </form>
    </Layout>
  );
}
