import type { ListItem } from "../types";

interface ItemRowProps {
  item: ListItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

function ItemRow({ item, onEdit, onDelete }: ItemRowProps) {
  return (
    <div className="item-row">
      {item.image && <img src={item.image} alt={item.name} width={48} height={48} />}
      <div>
        <strong>{item.name}</strong>
        {item.notes && <div>{item.notes}</div>}
      </div>
      <span>Qty: {item.quantity}</span>
      <span>{item.category}</span>
      {onEdit && <button onClick={onEdit}>Edit</button>}
      {onDelete && <button onClick={onDelete}>Delete</button>}
    </div>
  );
}

export default ItemRow;