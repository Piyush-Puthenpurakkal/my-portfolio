// pages/blog/[slug].js
import fs from "fs";
import path from "path";
import { format } from "date-fns";

export async function getStaticPaths() {
  const dataPath = path.join(process.cwd(), "data", "blogposts.json");
  const fileContents = fs.readFileSync(dataPath, "utf8");
  const posts = JSON.parse(fileContents);

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const dataPath = path.join(process.cwd(), "data", "blogposts.json");
  const fileContents = fs.readFileSync(dataPath, "utf8");
  const posts = JSON.parse(fileContents);

  const post = posts.find((p) => p.slug === params.slug);
  // Preformat the date here as well
  return {
    props: {
      post: {
        ...post,
        formattedDate: format(new Date(post.date), "MM/dd/yyyy"),
      },
    },
  };
}

export default function BlogPost({ post }) {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{post.formattedDate}</p>
      <div className="prose">{post.content}</div>
    </div>
  );
}
