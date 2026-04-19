import BlogDetailsHero from '@/components/blog/BlogDetailsHero';
import BlogContent from '@/components/blog/BlogContent';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogDetailsCallToAction from '@/components/blog/BlogDetailsCallToAction';

// This is a mock function that would eventually fetch data from an API
async function getBlogPost(slug: string) {
  // Mock data based on the provided HTML
  return {
    title: "The Comprehensive Guide to Workspace Ergonomics for Remote Workers",
    category: "Ergonomics",
    date: "October 24, 2023",
    readTime: "6 min read",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ-CvPS372aG8HpsunbWMa8zlYouzK_Bx_VvS-_zEuKQ3Yq06n3r1Tvq7nKre9A6676DRHIs2EPQaAbIrdyqYd-EPrm7zUcKj92l5uxcTflqtRTOOwR8eL1y5bzzyiPbTlRJcjwdhHkSEk8EYiqCaPGkFeLsZNsWNSEaLQALcWJFEsYkvwMO8u_OJNCJJoXvT8GIyJKlmnFZYCWqPWzEOOQbHHPNrA-7RGn3iTCXXN3CKJN3Z-YkqjJLbBb--tRGQGitx6X4JaQyg",
    author: {
      name: "Dr. Shah Alam",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXyswzoTx0Ks3xnTRTj39uHpQsl1ZuUMtsAAL9aHcJuQLx8alBskvzCXQXp8Oi4vlwgGBhwQaG70s3K0GJyOzq-GchzxNoFsAStwzkgWzPkat2_XMpTiGt8hmpOZR3JxvM6PFxuxtsWfxWpKzOMMQ4bh39Kd-6aTgnq5e7asU2WjtjG7TiHe6KRX39buIcw5iIq7cHHlDh5dWKWJIRshM8iluJ7k3EJWtyHQQq8ZlJyY2TzlNbeAMYY3NJE8t3-uwIIZsf1UtPcEU",
      bio: "Dr. Alam is a renowned Orthopedic Specialist with over 15 years of experience treating musculoskeletal disorders. He combines modern medical science with holistic lifestyle adjustments to help patients achieve long-term recovery."
    },
    content: (
      <>
        <p className="lead text-xl text-gray-600 dark:text-gray-300 font-medium mb-8">
          As remote work becomes the norm for millions worldwide, the lines between our living spaces and workspaces have blurred. While the flexibility is welcome, the makeshift desks at kitchen tables and sofas have led to a sharp increase in musculoskeletal complaints.
        </p>
        <h2>The Silent Epidemic: Why Ergonomics Matters</h2>
        <p>
          It starts subtly—a stiff neck after a Zoom call, a dull ache in the lower back by 4 PM. These are not just signs of aging; they are your body&apos;s distress signals responding to poor posture and inadequate support. <strong>Ergonomics</strong> is not just about expensive chairs; it&apos;s the science of fitting the task to the human, ensuring that your work environment supports your body&apos;s natural alignment rather than forcing it into harmful positions.
        </p>
        <blockquote>
          &quot;The best posture is your next posture. Movement is the key to preventing stiffness and pain during long work hours.&quot;
        </blockquote>
        <h3>Setting Up Your Ideal Workspace</h3>
        <p>Creating an ergonomic setup doesn&apos;t require a complete office renovation. Start with these foundational elements:</p>
        <ul className="marker:text-primary">
          <li><strong>Monitor Height:</strong> The top of your screen should be at or slightly below eye level. This prevents you from tilting your head back or hunching forward, protecting your cervical spine.</li>
          <li><strong>Elbow Alignment:</strong> Your elbows should be at a 90-degree angle, resting comfortably by your sides. If your desk is too high, this forces your shoulders to shrug, leading to tension headaches.</li>
          <li><strong>Lumbar Support:</strong> Your lower back has a natural inward curve. A good chair should support this curve. If yours doesn&apos;t, a small pillow or rolled towel can work wonders.</li>
          <li><strong>Feet Position:</strong> Feet should be flat on the floor. If they dangle, it puts pressure on the back of your thighs, cutting off circulation. Use a footrest or a stack of books if needed.</li>
        </ul>
        <h3>The 20-20-20 Rule and Micro-Breaks</h3>
        <p>
          Even with the perfect chair, remaining static is detrimental. The human body is designed for motion. I recommend the 20-20-20 rule to my patients: every 20 minutes, look at something 20 feet away for 20 seconds. This reduces eye strain. Additionally, stand up and stretch every hour. Simple movements like shoulder rolls, neck stretches, and torso twists can reset your posture and improve blood flow.
        </p>
        <h3>When to Seek Professional Help</h3>
        <p>
          If you experience persistent numbness, tingling in your fingers (a potential sign of carpal tunnel), or pain that doesn&apos;t subside after rest, it is crucial to consult a specialist. Early intervention can prevent chronic conditions.
        </p>
      </>
    ),
    toc: [
      { title: "The Silent Epidemic", href: "#", isActive: true },
      { title: "Setting Up Your Ideal Workspace", href: "#" },
      { title: "Monitor Height & Posture", href: "#" },
      { title: "The 20-20-20 Rule", href: "#" },
      { title: "When to Seek Help", href: "#" }
    ],
    relatedArticles: [
      {
        category: "Rehabilitation",
        title: "5 Yoga Poses for Lower Back Pain Relief",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfVy-hECVBOGFvnbBAq98jhu2deQmdnGQPyKmxaUPMVIJ0vWY-1oLCLh83-7dKhjon8k0n-s6T68LyWsUCDWfPIWHPepKRLhMzCFk7qduw7ab4qTGf81kQCVsKAjmH1CMo4RQGc1atnYsN5LW36XFAsiQO0crLozphvXNMiTR1wlZWQY_MDR9WnItGQV5hpWkO4PCFLBy83SA4tApD0TbvNTDZKiAsxJ0HD5fLdn3QOeoEAOkF055LuRfYg68iHlm8_tulxhjDZL0",
        href: "#"
      },
      {
        category: "Sleep",
        title: "Best Sleeping Positions for Back Pain",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHJW2_Ueex3EXL5Qm1ynM3CDW_ngk9ABTRhBqlYy00Hm5ild8A74BOrumslVmZ7DA93O8Bh-MWFZ3CrSPIW3ZdmYNYUxeQszmLe-f2YCLH63r06O9-9vmxVTwxz9iKmtEpJzc3m4OEQhfSkoYF_nJ6nk-PsYpDzarNbuhTbJotueF8x23NsQWPHTLeONZrUgUmHe7iuU2FGxDZQ9VKqUcfB5dfUJWEtMMpfK526StBGfZLpSAkYOKtGOVcdoNCrnOMDWuIGbquntk",
        href: "#"
      },
      {
        category: "Therapy",
        title: "Frozen Shoulder: Recovery Timeline",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmcOC0zZjsNKoYJx-YRKI8lewO5-QT4vfQW6dQnvq91n-WgKI0aczFhkhfVA-V3EL5CcTPJnJ_-dOLQVOFFB9pZB9EtIprizpBPOCt975DlEHS-IvJ2RRwSJofygXcEmJRlaGte5EVu3GGygnI1Lqkd095w2yEv0zsSnPuN6sa461QEssVAVSNABmxAuUgwo32O_d5xzOwAhEvAaJJIAelfcTcmaHb_894l0rDLet2r12GvTkZgYA9blXimmH5wyvqKBjLP12-JOg",
        href: "#"
      }
    ]
  };
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  return (
    <main className="flex-grow">
      <BlogDetailsHero 
        category={post.category}
        title={post.title}
        authorName={post.author.name}
        authorImage={post.author.image}
        date={post.date}
        readTime={post.readTime}
      />
      <section className="bg-background-light dark:bg-background-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            <BlogContent 
              imageUrl={post.imageUrl}
              content={post.content}
              author={post.author}
            />
            <BlogSidebar 
              toc={post.toc}
              relatedArticles={post.relatedArticles}
            />
          </div>
        </div>
      </section>
      <BlogDetailsCallToAction />
    </main>
  );
}
