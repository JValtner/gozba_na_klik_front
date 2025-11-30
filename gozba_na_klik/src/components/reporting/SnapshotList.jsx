import React from "react";

const SnapshotList = ({ snapshots, onDownload }) => {
  if (!snapshots || snapshots.length === 0) return <p>No snapshots available.</p>;

  return (
    <div className="snapshot-list">
      {snapshots.map(s => (
        <div
          key={s.id}
          className="snapshot-item"
        >
          <div className="snapshot-info">
            Snimljen mesečni izveštaj: <strong>{s.month}/{s.year}</strong>
          </div>

          <button
            className="download-button"
            onClick={() => onDownload(s.id)}
          >
             ⬇️ Preuzmi
          </button>
        </div>
      ))}
    </div>
  );
};

export default SnapshotList;
