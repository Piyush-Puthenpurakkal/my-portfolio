import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AccomplishmentsPage() {
  const { data, error } = useSWR("/api/accomplishments", fetcher);

  if (error) return <div className="p-8">Failed to load accomplishments.</div>;
  if (!data) return <div className="p-8">Loading accomplishments...</div>;

  const accomplishments = data.accomplishments || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Accomplishments</h1>
      {accomplishments.map((item, index) => (
        <div key={index} className="mb-6 p-4 border rounded shadow">
          <h2 className="text-2xl font-semibold">{item.title}</h2>
          {item.issuer && <p className="italic">{item.issuer}</p>}
          {item.date && <p>{new Date(item.date).toLocaleDateString()}</p>}
          <p>{item.description}</p>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              Verify Certificate
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
