import { Pencil, Trash2 } from "lucide-react";
import styles from "./InventoryTable.module.css";

function InventoryTable({ medicines, onEdit, onDelete }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Side Effects</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.company}</td>
              <td className={styles.sideEffects}>{m.sideEffects}</td>
              <td>{m.quantity}</td>
              <td>${m.price}</td>
              <td className={styles.actions}>
                <button onClick={() => onEdit(m.id)}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => onDelete(m.id)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {medicines.length === 0 && (
        <p className={styles.empty}>No medicines found</p>
      )}
    </div>
  );
}

export default InventoryTable;
