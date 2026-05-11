import Link from "next/link";
import { Gamepad2, Mic2, Swords, Trophy } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";

const features = [
  {
    title: "Daily Quiz Mode",
    description: "A rotating featured player challenge with faster mind-reading rounds.",
    icon: Trophy,
    href: "/play?mode=daily"
  },
  {
    title: "Random Player Mode",
    description: "Jump into a full-league guessing session with no team filter at all.",
    icon: Gamepad2,
    href: "/play?mode=random"
  },
  {
    title: "Voice Assistant",
    description: "Browser-powered player intros and spoken AI questions for a proper live-ground atmosphere.",
    icon: Mic2,
    href: "/play"
  },
  {
    title: "Challenge Your Friends",
    description: "Pass the device, let someone think of a player, and watch the guess narrow like a captain setting a field.",
    icon: Swords,
    href: "/play"
  }
] as const;

export function FeatureStrip() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <Link key={feature.title} href={feature.href} className="group block">
            <GlassPanel className="h-full p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-200/25">
              <div className="flex h-full flex-col gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200/20 bg-leather/60 text-amber-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg uppercase tracking-[0.18em] text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{feature.description}</p>
                </div>
              </div>
            </GlassPanel>
          </Link>
        );
      })}
    </section>
  );
}
