import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setLists, setSharedLists, addList, updateList, deleteList } from "../store/listsSlice";
import {
  fetchLists, fetchSharedLists, saveNewList, saveList, removeList, getUserByEmail,
} from "../utils/api";
import { CATEGORIES, SORT_OPTIONS, type SortValue } from "../utils/constants";
import { prepareLists } from "../utils/listHelpers";
import ListCard from "../components/ListCard";
import ItemModal from "../components/ItemModal";
import ShareModal from "../components/ShareModal";
import SearchSortBar from "../components/SearchSortBar";
import CategoryChips from "../components/CategoryChips";
import type { ItemFormValues, ListItem, ShoppingList } from "../types";

type ModalState =
  | { mode: "add" }
  | { mode: "addToList"; list: ShoppingList }
  | { mode: "edit"; list: ShoppingList; item: ListItem }
  | null;

function Home() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const lists = useAppSelector((state) => state.lists.lists);
  const sharedLists = useAppSelector((state) => state.lists.sharedLists);

  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [sharingListId, setSharingListId] = useState<number | null>(null);

  // search, sort and category live in the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const sortParam = searchParams.get("sort");
  const sort: SortValue = SORT_OPTIONS.some((o) => o.value === sortParam)
    ? (sortParam as SortValue)
    : "date";
  const categoryParam = searchParams.get("category") ?? "";
  // only accept a real category, otherwise show everything
  const category = CATEGORIES.includes(categoryParam) ? categoryParam : "";

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const visibleLists = useMemo(
    () => prepareLists(lists, search, sort, category),
    [lists, search, sort, category]
  );
  const visibleShared = useMemo(
    () => prepareLists(sharedLists, search, sort, category),
    [sharedLists, search, sort, category]
  );

  // the list currently open in the share popup (read from Redux so it stays up to date)
  const sharingList = lists.find((l) => l.id === sharingListId) ?? null;

  // load my lists and the lists shared with me
  useEffect(() => {
    if (!currentUser) return;
    Promise.all([fetchLists(currentUser.id), fetchSharedLists(currentUser.email)])
      .then(([mine, shared]) => {
        dispatch(setLists(mine));
        dispatch(setSharedLists(shared));
      })
      .catch(() => toast.error("Could not load your lists"))
      .finally(() => setIsLoading(false));
  }, [currentUser, dispatch]);

  if (!currentUser) return null;

  const handleAdd = async (values: ItemFormValues) => {
    const newItem: ListItem = {
      id: crypto.randomUUID(),
      name: values.name,
      quantity: values.quantity,
      category: values.category,
      notes: values.notes,
      image: values.image,
      dateAdded: new Date().toISOString(),
    };

    const existing = lists.find((l) => l.name.toLowerCase() === values.listName.toLowerCase());

    try {
      if (existing) {
        const saved = await saveList({ ...existing, items: [...existing.items, newItem] });
        dispatch(updateList(saved));
      } else {
        const created = await saveNewList({
          userId: currentUser.id,
          name: values.listName,
          items: [newItem],
          sharedWith: [],
        });
        dispatch(addList(created));
      }
      toast.success(`${values.name} added to ${values.listName}`);
      setModal(null);
    } catch {
      toast.error("Could not save the item");
    }
  };

  const handleEdit = async (listId: number, itemId: string, values: ItemFormValues) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;

    const items = list.items.map((i) =>
      i.id === itemId
        ? { ...i, name: values.name, quantity: values.quantity, category: values.category, notes: values.notes, image: values.image }
        : i
    );
    try {
      const saved = await saveList({ ...list, items });
      dispatch(updateList(saved));
      toast.success("Item updated");
      setModal(null);
    } catch {
      toast.error("Could not update the item");
    }
  };

  const handleDeleteItem = async (listId: number, itemId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;

    try {
      const saved = await saveList({ ...list, items: list.items.filter((i) => i.id !== itemId) });
      dispatch(updateList(saved));
      toast.success("Item deleted");
    } catch {
      toast.error("Could not delete the item");
    }
  };

  const handleDeleteList = async (list: ShoppingList) => {
    if (!window.confirm(`Delete "${list.name}" and all its items?`)) return;
    try {
      await removeList(list.id);
      dispatch(deleteList(list.id));
      toast.success("List deleted");
    } catch {
      toast.error("Could not delete the list");
    }
  };

  // SHARE: add a registered user's email to the list
  const handleShareAdd = async (rawEmail: string) => {
    if (!sharingList) return;
    const email = rawEmail.trim().toLowerCase();

    if (!email) {
      toast.error("Enter an email address");
      return;
    }
    if (email === currentUser.email) {
      toast.error("You can't share a list with yourself");
      return;
    }
    if (sharingList.sharedWith.includes(email)) {
      toast.error("Already shared with that person");
      return;
    }

    try {
      const user = await getUserByEmail(email);
      if (!user) {
        toast.error("No user with that email. They need to register first.");
        return;
      }
      const saved = await saveList({ ...sharingList, sharedWith: [...sharingList.sharedWith, email] });
      dispatch(updateList(saved));
      toast.success(`Shared with ${email}`);
    } catch {
      toast.error("Could not share the list");
    }
  };

  const handleShareRemove = async (email: string) => {
    if (!sharingList) return;
    try {
      const saved = await saveList({
        ...sharingList,
        sharedWith: sharingList.sharedWith.filter((e) => e !== email),
      });
      dispatch(updateList(saved));
      toast.success("Stopped sharing");
    } catch {
      toast.error("Could not update sharing");
    }
  };

  return (
  <div className="page">
    <div className="page-header">
      <h1>My lists</h1>
      <button onClick={() => setModal({ mode: "add" })}>+ New list</button>
    </div>


      <SearchSortBar
        search={search}
        sort={sort}
        onSearchChange={(value) => updateParam("search", value)}
        onSortChange={(value) => updateParam("sort", value)}
      />

      <CategoryChips selected={category} onSelect={(value) => updateParam("category", value)} />

      {isLoading && <p>Loading your lists...</p>}
      {!isLoading && lists.length === 0 && sharedLists.length === 0 && (
        <p>You have no lists yet. Click "+ New list" to start.</p>
      )}
      {!isLoading && (search || category) && visibleLists.length === 0 && visibleShared.length === 0 && (
        <p>No items match your search and filters.</p>
      )}

      {visibleLists.map((list) => (
        <ListCard
  key={list.id}
  list={list}
  onAddItem={() => setModal({ mode: "addToList", list })}
  onEditItem={(item) => setModal({ mode: "edit", list, item })}
  onDeleteItem={(item) => handleDeleteItem(list.id, item.id)}
  onDeleteList={() => handleDeleteList(list)}
  onShare={() => setSharingListId(list.id)}
/>
      ))}

      {visibleShared.length > 0 && (
        <>
          <h2>Shared with you</h2>
          {visibleShared.map((list) => (
            <ListCard key={list.id} list={list} readOnly />
          ))}
        </>
      )}
{modal?.mode === "add" && (
  <ItemModal
    title="Add item"
    initialValues={{ listName: "", name: "", quantity: 1, category: CATEGORIES[0], notes: "", image: "" }}
    onSubmit={handleAdd}
    onClose={() => setModal(null)}
  />
)}
      {modal?.mode === "addToList" && (
  <ItemModal
    title={`Add item to ${modal.list.name}`}
    lockListName
    initialValues={{ listName: modal.list.name, name: "", quantity: 1, category: CATEGORIES[0], notes: "", image: "" }}
    onSubmit={handleAdd}
    onClose={() => setModal(null)}
  />
)}

      {modal?.mode === "edit" && (
        <ItemModal
          title="Edit item"
          lockListName
          initialValues={{
            listName: modal.list.name,
            name: modal.item.name,
            quantity: modal.item.quantity,
            category: modal.item.category,
            notes: modal.item.notes ?? "",
            image: modal.item.image ?? "",
          }}
          onSubmit={(values) => handleEdit(modal.list.id, modal.item.id, values)}
          onClose={() => setModal(null)}
        />
      )}

      {sharingList && (
        <ShareModal
          list={sharingList}
          onAdd={handleShareAdd}
          onRemove={handleShareRemove}
          onClose={() => setSharingListId(null)}
        />
      )}
    </div>
  );
}

export default Home;