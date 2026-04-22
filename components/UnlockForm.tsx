"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UnlockForm(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setMessage(null);
    setIsError(false);

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        });

        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          setIsError(true);
          setMessage(payload.message ?? "We could not verify this purchase email yet.");
          return;
        }

        setMessage("Access unlocked. Reloading your premium database view now.");
        setEmail("");
        router.refresh();
      } catch {
        setIsError(true);
        setMessage("Network issue while verifying purchase email. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="unlock-email" className="block text-sm font-medium text-[#c9d1d9]">
        Enter the Stripe checkout email you used
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="unlock-email"
          type="email"
          value={email}
          required
          onChange={(event) => setEmail(event.target.value)}
          placeholder="founder@yourstartup.com"
          className="sm:flex-1"
        />
        <Button type="submit" disabled={isPending} className="sm:w-44">
          {isPending ? "Verifying..." : "Unlock Premium"}
        </Button>
      </div>

      {message ? (
        <div
          className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
            isError
              ? "border-[#f85149]/40 bg-[#f85149]/10 text-[#ffb4b0]"
              : "border-[#238636]/40 bg-[#238636]/10 text-[#8ddb8c]"
          }`}
        >
          {isError ? <KeyRound className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <span>{message}</span>
        </div>
      ) : null}
    </form>
  );
}
