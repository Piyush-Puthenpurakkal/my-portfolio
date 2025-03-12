import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState } from "react";
import useSWR, { mutate } from "swr";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/admin/accomplishments",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminAccomplishments() {
  const { data, error } = useSWR("/api/accomplishments", fetcher);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function handleAddAccomplishment(e) {
    e.preventDefault();
    const newAcc = { title, issuer, date, description, url };
    const res = await fetch("/api/accomplishments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAcc),
    });
    if (res.ok) {
      mutate("/api/accomplishments");
      setTitle("");
      setIssuer("");
      setDate("");
      setDescription("");
      setUrl("");
    }
  }

  async function handleEditAccomplishment(e) {
    e.preventDefault();
    const updatedAcc = { title, issuer, date, description, url };
    const res = await fetch(`/api/accomplishments/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAcc),
    });
    if (res.ok) {
      mutate("/api/accomplishments");
      setEditingId(null);
      setTitle("");
      setIssuer("");
      setDate("");
      setDescription("");
      setUrl("");
    }
  }

  const startEdit = (acc) => {
    setEditingId(acc._id);
    setTitle(acc.title);
    setIssuer(acc.issuer || "");
    setDate(acc.date ? acc.date.substring(0, 10) : "");
    setDescription(acc.description);
    setUrl(acc.url || "");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this accomplishment?")) {
      const res = await fetch(`/api/accomplishments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        mutate("/api/accomplishments");
      }
    }
  };

  if (error) return <div className="p-8">Failed to load accomplishments.</div>;
  if (!data) return <div className="p-8">Loading accomplishments...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Accomplishments</h1>
      <form
        onSubmit={
          editingId ? handleEditAccomplishment : handleAddAccomplishment
        }
        className="mb-6 space-y-4 border p-4 rounded"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Issuer"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="url"
          placeholder="Verification URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full"
        />
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Accomplishment" : "Add Accomplishment"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setIssuer("");
                setDate("");
                setDescription("");
                setUrl("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      <ul>
        {data.accomplishments.map((acc) => (
          <li key={acc._id} className="border p-4 rounded mb-2">
            <h2 className="font-bold">{acc.title}</h2>
            {acc.issuer && <p>Issuer: {acc.issuer}</p>}
            <p>Date: {acc.date ? acc.date.substring(0, 10) : ""}</p>
            <p>{acc.description}</p>
            {acc.url && (
              <a
                href={acc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Verify Certificate
              </a>
            )}
            <div className="mt-2">
              <button
                onClick={() => startEdit(acc)}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(acc._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
