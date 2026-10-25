import type { ListItem, ShoppingList } from "../types";
import ItemRow from "./ItemRow";

interface ListCardProps {
  list: ShoppingList;
  readOnly?: boolean; // true for lists shared with you
  onAddItem?: () => void;
  onEditItem?: (item: ListItem) => void;
  onDeleteItem?: (item: ListItem) => void;
  onDeleteList?: () => void;
  onShare?: () => void;
}

function ListCard({ list, readOnly = false, onAddItem, onEditItem, onDeleteItem, onDeleteList, onShare }: ListCardProps) {
  return (
    <section className="list-card">
      <div className="list-card-header">
        <h3>{list.name}</h3>
        {!readOnly && (
          <div>
            {list.sharedWith.length > 0 && <span>Shared with {list.sharedWith.length} </span>}
            <button onClick={onAddItem}>+ Add item</button>
            <button onClick={onShare}>Share</button>
            <button onClick={onDeleteList}>Delete list</button>
            
          </div>
        )}
      </div>

      {list.items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        list.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onEdit={onEditItem ? () => onEditItem(item) : undefined}
            onDelete={onDeleteItem ? () => onDeleteItem(item) : undefined}
          />
        ))
      )}
    </section>
  );
}

export default ListCard;