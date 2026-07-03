"use client";

import { useState, useEffect } from "react";

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";

  useEffect(() => {
    fetchApprovedComments();
  }, [postId]);

  const fetchApprovedComments = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/crm/comments?status=approved`, {
        headers: { "x-site-id": siteId }
      });
      const result = await res.json();
      if (result.success) {
        // Filter comments belonging to this post
        const postComments = (result.data.comments || []).filter(
          (c) => c.postId === postId
        );
        setComments(postComments);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch(`${baseUrl}/api/crm/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-site-id": siteId
        },
        body: JSON.stringify({
          postId,
          authorName: formData.name,
          authorEmail: formData.email,
          content: formData.content
        })
      });

      const result = await res.json();
      if (result.success) {
        setMsg({ type: "success", text: "Comment submitted successfully! It is pending moderation." });
        setFormData({ name: "", email: "", content: "" });
      } else {
        setMsg({ type: "error", text: result.error || "Failed to submit comment." });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error. Try again later." });
    }
    setSubmitting(false);
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm space-y-8 mt-8">
      <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
        Comments ({comments.length})
      </h3>

      {/* List Comments */}
      {loading ? (
        <p className="text-xs text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400 italic">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-950">{c.authorName}</span>
                <span className="text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 italic">"{c.content}"</p>
            </div>
          ))}
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-100 pt-6">
        <h4 className="text-sm font-bold text-gray-800">Add a Comment</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            type="text"
            placeholder="Name"
            className="border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary w-full"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <textarea
          required
          rows={3}
          placeholder="Write your comment..."
          className="border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary w-full"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />

        {msg && (
          <div className={`p-2.5 rounded-xl text-xs ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {msg.text}
          </div>
        )}

        <button
          disabled={submitting}
          type="submit"
          className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Comment"}
        </button>
      </form>
    </div>
  );
}
