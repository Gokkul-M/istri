import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock, User, Phone, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStore } from "@/store/useStore";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["customer", "launderer"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(1, "Password is required"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addUser } = useStore();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  const preSelectedRole = location.state?.role as "customer" | "launderer" | undefined;

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: preSelectedRole || "customer",
    },
  });

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSignUp = (data: SignUpFormValues) => {
    // Simulate account creation
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.fullName,
      email: data.email,
      phone: data.phoneNumber,
      role: data.role,
      avatar: "",
      address: "",
      pinCode: "",
    };

    addUser(newUser);

    toast({
      title: "Account Created!",
      description: "Your account has been created successfully.",
    });

    // Navigate based on role
    setTimeout(() => {
      if (data.role === "customer") {
        navigate("/customer");
      } else {
        navigate("/launderer");
      }
    }, 1000);
  };

  const onSignIn = (data: SignInFormValues) => {
    toast({
      title: "Sign In Successful",
      description: "Welcome back!",
    });

    // Simulate sign in - navigate to customer dashboard
    setTimeout(() => {
      navigate("/customer");
    }, 1000);
  };

  const handleGoogleAuth = () => {
    toast({
      title: "Google Authentication",
      description: "Google sign-in will be implemented with backend",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Welcome</h1>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-lg rounded-3xl">
          <CardHeader className="space-y-4">
            <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "signin" | "signup")} className="w-full">
              <TabsList className="w-full bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="signin" className="flex-1 rounded-lg data-[state=active]:bg-background">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex-1 rounded-lg data-[state=active]:bg-background">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="mt-6">
                <div className="text-center mb-6">
                  <CardTitle className="text-xl font-semibold mb-1">Sign in to your account</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
                </div>

                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                    <FormField
                      control={signInForm.control}
                      name="emailOrPhone"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Email or Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="email@example.com or 9043405357"
                                className={`pl-10 h-12 rounded-xl ${
                                  fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""
                                }`}
                                {...field}
                              />
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              {fieldState.isDirty && !fieldState.error && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className={`pl-10 h-12 rounded-xl ${
                                  fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""
                                }`}
                                {...field}
                              />
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              {fieldState.isDirty && !fieldState.error && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full h-12 rounded-xl">
                      Sign In
                    </Button>

                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">OR</span>
                      </div>
                    </div>

                    <Button type="button" variant="outline" onClick={handleGoogleAuth} className="w-full h-12 rounded-xl">
                      <Mail className="mr-2 h-5 w-5" />
                      Continue with Google
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="mt-6">
                <div className="text-center mb-6">
                  <CardTitle className="text-xl font-semibold mb-1">Create your account</CardTitle>
                  <p className="text-sm text-muted-foreground">Fill in the details to get started</p>
                </div>

                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                    <FormField
                      control={signUpForm.control}
                      name="fullName"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="John Doe"
                                className={`pl-10 h-12 rounded-xl ${
                                  fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""
                                }`}
                                {...field}
                              />
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              {fieldState.isDirty && !fieldState.error && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                className={`pl-10 h-12 rounded-xl ${
                                  fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""
                                }`}
                                {...field}
                              />
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              {fieldState.isDirty && !fieldState.error && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="phoneNumber"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="tel"
                                placeholder="9043405357"
                                className={`pl-10 h-12 rounded-xl ${
                                  fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""
                                }`}
                                {...field}
                              />
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              {fieldState.isDirty && !fieldState.error && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className={`pl-10 h-12 rounded-xl ${
                                  fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""
                                }`}
                                {...field}
                              />
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              {fieldState.isDirty && !fieldState.error && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className={`pl-10 h-12 rounded-xl ${
                                  fieldState.error ? "border-destructive" : fieldState.isDirty && !fieldState.error ? "border-green-500" : ""
                                }`}
                                {...field}
                              />
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              {fieldState.isDirty && !fieldState.error && (
                                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>I am a</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="launderer">Launderer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full h-12 rounded-xl">
                      Create Account
                    </Button>

                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">OR</span>
                      </div>
                    </div>

                    <Button type="button" variant="outline" onClick={handleGoogleAuth} className="w-full h-12 rounded-xl">
                      <Mail className="mr-2 h-5 w-5" />
                      Continue with Google
                    </Button>

                    <p className="text-xs text-center text-muted-foreground px-4">
                      By continuing, you agree to our{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
