import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Menu,
  Plus,
  Grip,
  Home,
  Calendar,
  BookOpenText,
  Sparkles,
  ListFilter,
  Users,
  GraduationCap,
  Archive,
  Settings,
  ArrowLeft,
  NotebookPen,
  Wand2,
  MessageSquareText,
  Image as ImageIcon,
  FileText,
  BookMarked,
  Lightbulb,
  PenTool,
  BrainCircuit,
  Stars,
} from "lucide-react";

export const Route = createFileRoute("/ai-tools")({
  head: () => ({
    meta: [
      { title: "AI Tools — Classroom Admin" },
      {
        name: "description",
        content:
          "Explore Gemini-powered AI tools for teaching and learning in Classroom Admin.",
      },
      { property: "og:title", content: "AI Tools — Classroom Admin" },
      {
        property: "og:description",
        content: "Gemini-powered AI tools for teaching and learning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AIToolsPage,
});

const railIcons = [
  { icon: Home, label: "Home" },
  { icon: Calendar, label: "Calendar" },
  { icon: BookOpenText, label: "Classes" },
  { icon: Sparkles, label: "AI tools", active: true },
  { icon: ListFilter, label: "Review" },
  { icon: Users, label: "People", gap: true },
  { icon: GraduationCap, label: "Enrolled" },
  { icon: Archive, label: "Archived" },
  { icon: Settings, label: "Settings" },
];

const tools = [
  {
    icon: MessageSquareText,
    tint: "bg-[oklch(0.93_0.05_255)] text-[oklch(0.55_0.16_255)]",
    title: "Ask Gemini",
    body: "Get quick answers, explanations, and teaching ideas grounded in your curriculum.",
  },
  {
    icon: NotebookPen,
    tint: "bg-[oklch(0.93_0.06_150)] text-[oklch(0.55_0.14_150)]",
    title: "Gemini Notebook",
    body: "Turn dense material into study guides, summaries, and practice questions.",
  },
  {
    icon: ImageIcon,
    tint: "bg-[oklch(0.94_0.05_300)] text-[oklch(0.58_0.15_300)]",
    title: "Generate visuals",
    body: "Create images, diagrams, and flashcards to make concepts stick.",
  },
  {
    icon: FileText,
    tint: "bg-[oklch(0.93_0.04_240)] text-[oklch(0.55_0.14_250)]",
    title: "Draft assignments",
    body: "Generate quiz questions, rubrics, and lesson outlines in seconds.",
  },
  {
    icon: BookMarked,
    tint: "bg-[oklch(0.93_0.05_60)] text-[oklch(0.62_0.15_50)]",
    title: "Personalized reading",
    body: "Adapt passages to reading levels and student interests.",
  },
  {
    icon: Lightbulb,
    tint: "bg-[oklch(0.93_0.05_85)] text-[oklch(0.65_0.14_75)]",
    title: "Brainstorm ideas",
    body: "Spark project ideas, discussion prompts, and hands-on activities.",
  },
  {
    icon: PenTool,
    tint: "bg-[oklch(0.93_0.04_200)] text-[oklch(0.55_0.14_215)]",
    title: "Feedback assistant",
    body: "Draft constructive feedback on student work using your grading style.",
  },
  {
    icon: BrainCircuit,
    tint: "bg-[oklch(0.93_0.05_10)] text-[oklch(0.6_0.16_10)]",
    title: "Differentiation coach",
    body: "Suggest modifications for English learners, advanced learners, and IEP goals.",
  },
];

function AIToolsPage() {
  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 hover:bg-tile" aria-label="Main menu">
            <Menu className="size-6 text-muted-foreground" />
          </button>
          <span className="grid size-7 place-items-center rounded-md bg-[oklch(0.62_0.16_150)]">
            <BookOpenText className="size-4 text-surface" />
          </span>
          <span className="text-xl sm:text-[22px]">Classroom</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-full p-2 hover:bg-tile" aria-label="Create">
            <Plus className="size-6 text-muted-foreground" />
          </button>
          <button className="rounded-full p-2 hover:bg-tile" aria-label="Google apps">
            <Grip className="size-6 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="flex">
        <nav className="hidden w-[72px] shrink-0 flex-col items-center gap-1 pt-2 md:flex">
          {railIcons.map(({ icon: Icon, label, active, gap }) => (
            <button
              key={label}
              aria-label={label}
              className={`grid size-12 place-items-center rounded-full ${gap ? "mt-4" : ""} ${
                active
                  ? "bg-chip-active text-chip-active-foreground"
                  : "text-muted-foreground hover:bg-tile"
              }`}
            >
              <Icon className="size-5" />
            </button>
          ))}
        </nav>

        <main className="min-w-0 flex-1 px-3 pb-12 sm:px-6">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-tile"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>

          <section className="rounded-3xl bg-gradient-to-br from-[oklch(0.55_0.18_275)] to-[oklch(0.6_0.16_255)] p-6 text-surface sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/20">
                <Stars className="size-6" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-[28px]">Gemini in Classroom</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-90">
                  Go from idea to instruction faster with a suite of AI tools built for teaching
                  and learning. Generate materials, adapt content, and give feedback grounded in
                  your sources.
                </p>
                <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:bg-white/90">
                  <Wand2 className="size-4" />
                  Try an example
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-3xl bg-surface p-5 sm:p-6">
            <h2 className="text-[22px]">Explore AI tools</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map(({ icon: Icon, tint, title, body }) => (
                <div key={title} className="flex gap-4 rounded-2xl bg-tile p-4">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tint}`}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
