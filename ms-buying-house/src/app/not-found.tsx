import { Container } from "@/components/container";
import { Button } from "@/components/button";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-24">
      <p className="eyebrow text-brand-600">Error 404</p>
      <h1 className="display-1 mt-5 max-w-2xl">
        That page has shipped without us.
      </h1>
      <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-500">
        The link may be out of date. Head back to the homepage, or tell us what
        you were looking for and we will point you at it.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button href="/" variant="dark" size="lg">
          Back to homepage
          <ArrowRight />
        </Button>
        <Button href="/contact" variant="outline" size="lg">
          Contact us
        </Button>
      </div>
    </Container>
  );
}
