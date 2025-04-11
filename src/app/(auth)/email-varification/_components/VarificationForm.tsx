"use client";

import { z } from "zod";
import axios from "axios";
import cookies from "js-cookie";
import { toast, Toaster } from "sonner";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const CreateFormSchema = z.object({
  otp: z.string().min(0, "Enter your OTP"),
});

type CreateFormValues = z.infer<typeof CreateFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<CreateFormValues> = {
  otp: "",
};

function VarificationForm() {
  const router = useRouter();
  const [error, setError] = useState();

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: CreateFormValues) {
    try {
      const activationToken = cookies.get("activationToken");
      await axios
        .post("/api/activation", {
          activationCode: data.otp,
          activationToken,
        })
        .then(() => {
          cookies.remove("activationToken");
          toast.success("Registration Successful!");
          router.push("/login");
        })
        .catch((err) => {
          setError(err.response.data);
          console.log("RegistrationError", err.response.data);
        });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }
  return (
    <div className="min-w-1/3 justify-center border py-16 px-14 bg-white rounded-lg shadow-md space-y-8">
      <h1 className="text-2xl font-bold text-center ">Varification</h1>
      <p>{error}</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8 justify-center items-center"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-center items-center font-bold">
                  OTP
                </FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field} autoFocus>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" size={"lg"}>
            Varify
          </Button>
        </form>
      </Form>
      <Toaster position="top-right" />
    </div>
  );
}

export default VarificationForm;
