"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CreateFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({
      required_error: "Please select a subcategory.",
    })
    .min(5, { message: "Password must be 5 or more characters long" }),
});

type CreateFormValues = z.infer<typeof CreateFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<CreateFormValues> = {
  password: "",
  email: "",
};

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: CreateFormValues) {
    toast.success("Form submitted successfully!");
    try {
      const values = await axios.post("/api/login", data);
      toast.success("Registration Successfull");
      router.push("/");
      console.log(values);
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
      <h1 className="text-3xl font-bold text-center mb-10">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size={"lg"}
            variant={"secondary"}
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </form>
      </Form>
      <div className="flex justify-center items-center pt-10">
        <h1>
          Don&lsquo;t have account?{" "}
          <span>
            <Link className="text-green-500 font-bold" href={"/create-account"}>
              Create Account
            </Link>
          </span>
        </h1>
      </div>
      <Toaster />
    </div>
  );
};
