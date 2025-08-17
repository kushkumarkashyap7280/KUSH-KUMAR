import { useEffect, useState } from "react";
import TitleHeader from "../components/TitleHeader";
import CustomPostCard from "../components/CustomPostCard";
import { getPublicPosts } from "../apis/posts";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await getPublicPosts();
        // apiRes: { statusCode, data: { items }, message, success }
        const list =
          data?.data?.items ||
          data?.items ||
          data?.posts ||
          (Array.isArray(data) ? data : []);
        const normalized = list.map((p) => {
          const id = p?._id?.$oid || p?._id || p?.id;
          const order = typeof p?.order === "object" && p?.order?.$numberInt
            ? Number(p.order.$numberInt)
            : Number(p?.order ?? 0);
          let published;
          if (p?.published === undefined) {
            // Public list omits 'published' since it's already filtered server-side
            published = true;
          } else if (typeof p?.published === "object" && p?.published?.$numberBoolean !== undefined) {
            published = String(p.published.$numberBoolean) === "true";
          } else {
            published = Boolean(p.published);
          }
          return { ...p, _id: id, order, published };
        });
        const filtered = normalized
          .filter((p) => p.published)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        if (mounted) setPosts(filtered);
      } catch (err) {
        console.error("getPublicPosts failed", err);
        if (mounted) setError("Failed to load posts.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="posts" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader title="Posts & Announcements" sub="📰 Latest updates" />

        {loading ? (
          <div className="mt-16 text-white/60">Loading posts…</div>
        ) : error ? (
          <div className="mt-16 text-red-400">{error}</div>
        ) : posts.length === 0 ? (
          <div className="mt-16 text-white/60">No posts yet.</div>
        ) : (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <div key={post._id || post.id} className="h-full">
                <CustomPostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;
