import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

interface BlogEntry {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

export default async function Page() {
  const postsDirectory = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(postsDirectory).filter((file) =>
    file.endsWith(".mdx")
  );

  // Extraemos y tipamos el frontmatter de cada archivo MDX
  const posts: BlogEntry[] = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    const meta = data as Partial<BlogEntry>;
    return {
      title: meta.title || "",
      date: meta.date || "",
      excerpt: meta.excerpt || "",
      slug: meta.slug || filename.replace(/\.mdx?$/, ""),
    };
  });

  // Ordenamos las entradas de la más reciente a la más antigua
  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Seleccionamos las 3 entradas más recientes
  const blogEntries = posts.slice(0, 3);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      {/* Sección Hero */}
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`${DATA.name} `}
              />
              <BlurFadeText
                className="max-w-[600px] md:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Sección Sobre Mi */}
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">Sobre mi</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.summary}
          </Markdown>
        </BlurFade>
      </section>

      {/* Sección Experiencia Laboral */}
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Experiencia Laboral</h2>
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade key={work.company} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
              <ResumeCard
                key={work.company}
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Sección Educación */}
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">Educación</h2>
          </BlurFade>
          {DATA.education.map((education, id) => (
            <BlurFade
              key={education.school}
              delay={BLUR_FADE_DELAY * 8 + id * 0.05}
            >
              <ResumeCard
                key={education.school}
                href={education.href}
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                period={`${education.start} - ${education.end}`}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Sección Conocimientos */}
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">Conocimientos</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge key={skill}>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Proyectos */}
      <section id="projects">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  Mis proyectos
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Algunos proyectos en los que he trabajado.
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A lo largo de mi vida he trabajado en varios proyectos que me han aportado
                  un gran crecimiento personal y profesional.
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {DATA.projects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              >
                <ProjectCard
                  href={project.href}
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Blog con entradas dinámicas */}
      <section id="blog">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 14}>
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                Blog
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Descubre mis artículos
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Lee mis reflexiones y experiencias en el blog. Publico de vez en cuando.
              </p>
              {/* Cuadrícula de las 3 entradas más recientes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {blogEntries.map((entry, idx) => (
                  <BlurFade key={entry.slug} delay={BLUR_FADE_DELAY * (15 + idx)}>
                    <div className="p-4 border rounded-lg hover:shadow-lg transition">
                      <h3 className="text-xl font-bold">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground">{entry.excerpt}</p>
                      <p className="text-xs text-gray-500 mt-1">{entry.date}</p>
                      <Link
                        href={`/blog/${entry.slug}`}
                        className="text-blue-500 hover:underline mt-2 inline-block"
                      >
                        Leer más
                      </Link>
                    </div>
                  </BlurFade>
                ))}
              </div>
              <Link
                href="/blog"
                className="inline-block mt-8 px-6 py-3 bg-foreground text-background font-semibold rounded-2xl shadow-lg"
              >
                Visitar Blog
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section id="contact">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                Contacto
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Contáctame
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                ¿Quieres hablar?{" "}
                <Link
                  href={DATA.contact.social.X.url}
                  className="text-blue-500 hover:underline"
                >
                  Escríbeme un Dm a través de X.
                </Link>{" "}
                Responderé lo antes posible.
              </p>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
