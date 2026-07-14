import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Icon, Input, PageLoadingFallback } from "../components/common";
import { resolvePostLoginPath } from "../constants/permissions";
import {
  fetchCurrentAdmin,
  loginAdminRequest,
  saveAdminLoginChallenge,
} from "../lib/adminAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const requestedPath =
    (location.state as { from?: string } | null)?.from ?? null;

  useEffect(() => {
    let active = true;

    async function checkExistingSession() {
      try {
        const user = await fetchCurrentAdmin();
        if (active) {
          navigate(resolvePostLoginPath(user.role, requestedPath), {
            replace: true,
          });
        }
      } catch {
        // Not logged in — stay on login page.
      } finally {
        if (active) {
          setIsCheckingSession(false);
        }
      }
    }

    void checkExistingSession();

    return () => {
      active = false;
    };
  }, [navigate, requestedPath]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginAdminRequest(email.trim(), password);
      const challenge = response.data!;

      saveAdminLoginChallenge({
        challengeId: challenge.challengeId,
        expiresIn: challenge.expiresIn,
        maskedDestination: challenge.maskedDestination,
        resendAvailableIn: challenge.resendAvailableIn,
        requestedPath,
        createdAt: Date.now(),
      });

      toast.success(response.message ?? "Verification code sent");
      navigate("/verify-otp", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PageLoadingFallback />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-container/10 text-primary font-bold">
            Dr.
          </div>
          <h1 className="text-headline-md font-bold text-primary">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Sign in with your admin account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-label-md font-medium text-on-surface"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              leftIcon={<Icon name="mail" size={20} />}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-label-md font-medium text-on-surface"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              leftIcon={<Icon name="lock" size={20} />}
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            fullWidthOnMobile
            className="w-full justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending code..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
