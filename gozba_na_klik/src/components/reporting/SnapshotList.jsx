import React from "react";

const SnapshotList = ({ snapshots, onDownload }) => {
  if (!snapshots || snapshots.length === 0) return <p>No snapshots available.</p>;

  return (
    <div className="snapshot-list">
      {snapshots.map(s => (
        <div
          key={s.id}
          className="snapshot-item"
          onClick={() => onDownload(s.id)}
        >
          <span>Snimljen mesecni izvestaj za : {s.month}/{s.year}</span>
        </div>
      ))}
    </div>
  );
};

export default SnapshotList;

