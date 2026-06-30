import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { useResetPassword } from "./api/useResetPassword";

const formSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 14px 40px rgba(0, 0, 0, 0.45)"
      : "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const PageContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  background:
    theme.palette.mode === "dark"
      ? "radial-gradient(ellipse at 50% 50%, #1d2733, #000000)"
      : "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
}));

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      otp: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await resetPasswordMutation.mutateAsync(data);
    toast.success("Password reset successfully");
    navigate("/login");
  };

  return (
    <PageContainer>
      <Card>
        <Typography component="h1" variant="h4">
          Reset password
        </Typography>
        <Typography color="text.secondary">
          Enter the OTP from your email and choose a new password.
        </Typography>
        <Box
          component="form"
          noValidate
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
          <TextField
            label="OTP"
            fullWidth
            autoComplete="one-time-code"
            {...register("otp")}
            error={!!errors.otp}
            helperText={errors.otp?.message}
          />
          <TextField
            label="New password"
            type="password"
            fullWidth
            autoComplete="new-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting || resetPasswordMutation.isPending}
          >
            Reset password
          </Button>
        </Box>
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
