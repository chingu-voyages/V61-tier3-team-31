import { Card } from "../ui/card";
import { AuthActionButtons } from "./AuthActionButtons";
import { Section } from "./Section";

export async function ReadyToStartSection() {
  return (
    <Section>
      <Card className="px-6 sm:px-12 py-12 sm:py-18 flex flex-col items-center justify-center gap-4 text-center shadow-black">
        <h2>Ready to start the course?</h2>

        <p className="mb-6">
          Sign up in a minute and get access to your profile, progress and group.
        </p>

        <AuthActionButtons />
      </Card>
    </Section>
  );
}
