import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Icon, Input } from "../components/common";
import { resolvePostLoginPath } from "../constants/permissions";
import {
  clearAdminLoginChallenge,
  getAdminLoginChallenge,
  resendAdminOtpRequest,
  saveAdminLoginChallenge,
  verifyAdminOtpRequest,
  type AdminLoginChallenge,
} from "../lib/adminAuth";

function formatSeconds(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

let clientNow = 0;
const clientNowListeners = new Set<() => void>();
let clientNowIntervalId: number | null = null;

function ensureClientNowTicker(): void {
  if (typeof window === "undefined" || clientNowIntervalId !== null) {
    return;
  }

  clientNow = Date.now();
  clientNowIntervalId = window.setInterval(() => {
    clientNow = Date.now();
    for (const listener of clientNowListeners) {
      listener();
    }
  }, 1000);
}

function subscribeToClientNow(onStoreChange: () => void): () => void {
  ensureClientNowTicker();
  clientNowListeners.add(onStoreChange);
  return () => {
    clientNowListeners.delete(onStoreChange);
  };
}

function getClientNowSnapshot(): number {
  ensureClientNowTicker();
  return clientNow || Date.now();
}

function useClientNow(): number {
  return useSyncExternalStore(
    subscribeToClientNow,
    getClientNowSnapshot,
    () => 0,
  );
}

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<AdminLoginChallenge | null>(() =>
    getAdminLoginChallenge(),
  );
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const now = useClientNow();

  useEffect(() => {
    if (!challenge) {
      navigate("/login", { replace: true });
    }
  }, [challenge, navigate]);

  const expiresInSeconds = useMemo(() => {
    if (!challenge) {
      return 0;
    }
    const elapsed = Math.floor((now - challenge.createdAt) / 1000);
    return Math.max(0, challenge.expiresIn - elapsed);
  }, [challenge, now]);

  const resendInSeconds = useMemo(() => {
    if (!challenge) {
      return 0;
    }
    const elapsed = Math.floor((now - challenge.createdAt) / 1000);
    return Math.max(0, challenge.resendAvailableIn - elapsed);
  }, [challenge, now]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!challenge) {
      navigate("/login", { replace: true });
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("Enter the 6-digit verification code");
      return;
    }

    if (expiresInSeconds <= 0) {
      toast.error("Verification code expired. Please sign in again.");
      clearAdminLoginChallenge();
      navigate("/login", { replace: true });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await verifyAdminOtpRequest(
        challenge.challengeId,
        otp.trim(),
      );
      const role = response.data?.user.role ?? "ADMIN";
      toast.success("Welcome back");
      navigate(resolvePostLoginPath(role, challenge.requestedPath), {
        replace: true,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "OTP verification failed";
      toast.error(message);

      if (
        /expired|sign in again|maximum|locked|too many invalid/i.test(message)
      ) {
        clearAdminLoginChallenge();
        navigate("/login", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (!challenge || resendInSeconds > 0 || isResending || isSubmitting) {
      return;
    }

    setIsResending(true);

    try {
      const response = await resendAdminOtpRequest(challenge.challengeId);
      const next = response.data!;
      const updatedChallenge: AdminLoginChallenge = {
        challengeId: next.challengeId,
        expiresIn: next.expiresIn,
        maskedDestination: next.maskedDestination,
        resendAvailableIn: next.resendAvailableIn,
        requestedPath: challenge.requestedPath,
        createdAt: Date.now(),
      };

      saveAdminLoginChallenge(updatedChallenge);
      setChallenge(updatedChallenge);
      setOtp("");
      toast.success(response.message ?? "Verification code resent");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to resend verification code";
      toast.error(message);

      if (/sign in again|maximum|expired|invalid or expired/i.test(message)) {
        clearAdminLoginChallenge();
        navigate("/login", { replace: true });
      }
    } finally {
      setIsResending(false);
    }
  }

  if (!challenge) {
    return null;
  }

  const isExpired = expiresInSeconds <= 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-container/10 text-primary">
            <Icon name="mark_email_read" size={28} />
          </div>
          <h1 className="text-headline-md font-bold text-primary">
            Verify your identity
          </h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-on-surface">
              {challenge.maskedDestination}
            </span>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="block text-label-md font-medium text-on-surface"
            >
              Verification code
            </label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                const next = event.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(next);
              }}
              leftIcon={<Icon name="pin" size={20} />}
              disabled={isSubmitting || isExpired}
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-label-sm text-on-surface-variant">
            <span>
              {isExpired
                ? "Code expired"
                : `Expires in ${formatSeconds(expiresInSeconds)}`}
            </span>
            <button
              type="button"
              className="font-medium text-primary hover:text-primary-container disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => void handleResend()}
              disabled={
                isExpired ||
                isResending ||
                isSubmitting ||
                resendInSeconds > 0
              }
            >
              {isResending
                ? "Sending..."
                : resendInSeconds > 0
                  ? `Resend in ${formatSeconds(resendInSeconds)}`
                  : "Resend code"}
            </button>
          </div>

          <Button
            type="submit"
            fullWidthOnMobile
            className="w-full justify-center"
            disabled={isSubmitting || isExpired || otp.trim().length !== 6}
          >
            {isSubmitting ? "Verifying..." : "Verify and sign in"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-label-md text-on-surface-variant hover:text-primary"
            onClick={() => clearAdminLoginChallenge()}
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
