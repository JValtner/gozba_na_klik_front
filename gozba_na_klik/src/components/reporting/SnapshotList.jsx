import React from "react";

const SnapshotList = ({ snapshots, onDownload }) => {
  if (!snapshots || snapshots.length === 0) return null;

  return (
    <div className="snapshot-list">
      {snapshots.map(s => (
        <button key={s.id} onClick={() => onDownload(s.id)}>
          Preuzmi snimljeni izveštaj {s.month}/{s.year}
        </button>
      ))}
    </div>
  );
};

export default SnapshotList;
