"use client";

import { AddItemModal } from "@/components/add-item.modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface ShoppingItem {
  id: number;
  name: string;
  price: number | null;
  quantity: number;
  category: string;
  notes: string;
  completed: boolean;
  addedAt: string;
}

export interface FormData {
  name: string;
  price: string;
  quantity: string;
  category: string;
  notes: string;
}

const STORAGE_KEY = "shopping-list-items";

const loadItemsFromStorage = (): ShoppingItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erro ao carregar itens do localStorage:", error);
  }

  return [
    {
      id: 1,
      name: "Leite integral",
      price: 4.5,
      quantity: 2,
      category: "Laticínios",
      notes: "Marca Nestlé",
      completed: false,
      addedAt: "25/08/2025",
    },
    {
      id: 2,
      name: "Pão francês",
      price: 0.75,
      quantity: 10,
      category: "Padaria",
      notes: "",
      completed: true,
      addedAt: "25/08/2025",
    },
  ];
};

const saveItemsToStorage = (items: ShoppingItem[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Erro ao salvar itens no localStorage:", error);
  }
};

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedItems = loadItemsFromStorage();
    setItems(loadedItems);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveItemsToStorage(items);
    }
  }, [items, isLoaded]);

  const addItem = (newItem: ShoppingItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const toggleItem = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearAllItems = () => {
    if (confirm("Tem certeza que deseja limpar toda a lista?")) {
      setItems([]);
    }
  };

  const clearCompletedItems = () => {
    if (confirm("Tem certeza que deseja remover todos os itens completados?")) {
      setItems((prevItems) => prevItems.filter((item) => !item.completed));
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = items.filter((item) => item.completed).length;
  const totalValue = items.reduce((sum, item) => {
    if (item.price && !item.completed) {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0);

  if (!isLoaded) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-2">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Carregando lista...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <header className="mb-4">
            <h1 className="mb-2 font-medium text-lg">Nossa lista</h1>
            <div className="flex items-center justify-center gap-3">
              <Input
                placeholder="Pesquisar por...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <AddItemModal onAddItem={addItem} />
            </div>
          </header>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="text-gray-600">
              {completedCount} de {items.length} itens completados
            </div>
            <div className="text-right font-medium">
              Total estimado:{" "}
              <span className="text-green-600">R$ {totalValue.toFixed(2)}</span>
            </div>
          </div>

          {/* Botões de ação */}
          {items.length > 0 && (
            <div className="flex gap-2 mb-4">
              {completedCount > 0 && (
                <Button
                  onClick={clearCompletedItems}
                  size="sm"
                  variant="outline"
                >
                  Limpar Completados ({completedCount})
                </Button>
              )}
              <Button onClick={clearAllItems} size="sm" variant="outline">
                Limpar Tudo
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "Nenhum item encontrado" : "Sua lista está vazia"}
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    item.completed
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`flex items-center justify-center w-5 h-5 rounded border-2 mt-1 ${
                        item.completed
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {item.completed && <Check size={12} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-medium ${
                            item.completed
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {item.price && (
                            <span
                              className={`text-sm font-medium ${
                                item.completed
                                  ? "text-gray-400"
                                  : "text-green-600"
                              }`}
                            >
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                          )}
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {item.quantity > 1 && <span>Qtd: {item.quantity}</span>}
                        {item.category && <span>• {item.category}</span>}
                        {item.addedAt && <span>• {item.addedAt}</span>}
                      </div>

                      {item.notes && (
                        <p
                          className={`text-xs mt-1 ${
                            item.completed ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
