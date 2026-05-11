"use client";

import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginClient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key ? createClient(url, key) : undefined;
  }, []);

  async function signIn() {
    if (!supabase) {
      setMessage("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for Supabase Auth.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    });
    setLoading(false);
    setMessage(error ? error.message : "Login link sent");
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md shadow-panel">
        <CardHeader>
          <CardTitle>SAIL PRC Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sail-steel" />
              <Input className="pl-9" value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
            </div>
          </div>
          {message ? <div className="rounded-md border border-sail-line bg-sail-mist px-3 py-2 text-sm text-sail-steel">{message}</div> : null}
          <Button className="w-full" onClick={signIn} disabled={loading || !email}>
            <ArrowRight className="h-4 w-4" />
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
