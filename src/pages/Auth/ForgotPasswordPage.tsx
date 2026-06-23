import { useState } from "react";

import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { useForgotPassword } from "./api/useForgotPassword";

const formSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
});

type FormValues = z.infer<typeof formSchema>;

const Card = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  background: "white",
  borderRadius: theme.shape.borderRadius,
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const PageContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  background:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
}));

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await forgotPasswordMutation.mutateAsync(data);
    setSubmittedEmail(data.email);
    toast.success("Password reset OTP sent");
  };

  return (
    <PageContainer>
      <Card>
        <Typography component="h1" variant="h4">
          Forgot password
        </Typography>
        <Typography color="text.secondary">
          Enter your email to receive a password reset OTP.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting || forgotPasswordMutation.isPending}
          >
            Send OTP
          </Button>
        </Box>

        {forgotPasswordMutation.isSuccess && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              p: 2,
              bgcolor: "grey.100",
              borderRadius: 1,
            }}
          >
            <Typography>
              Check your inbox for the password reset OTP. It expires in 15
              minutes.
            </Typography>
            <Button
              variant="outlined"
              onClick={() =>
                navigate(
                  `/reset-password?email=${encodeURIComponent(submittedEmail)}`
                )
              }
            >
              Enter OTP
            </Button>
          </Box>
        )}

        <Link
          component="button"
          variant="body2"
          onClick={() => navigate("/login")}
        >
          Back to sign in
        </Link>
      </Card>
    </PageContainer>
  );
}
