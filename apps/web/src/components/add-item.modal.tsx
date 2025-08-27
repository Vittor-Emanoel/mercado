"use client";

import type { ShoppingItem } from "@/app/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface IAddItemModalProps {
  onAddItem: (item: ShoppingItem) => void;
}

export const AddItemModal = ({ onAddItem }: IAddItemModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "1",
    category: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAddItem({
        id: Date.now(),
        name: formData.name.trim(),
        price: formData.price ? parseFloat(formData.price) : null,
        quantity: parseInt(formData.quantity) || 1,
        category: formData.category.trim(),
        notes: formData.notes.trim(),
        completed: false,
        addedAt: new Date().toLocaleDateString("pt-BR"),
      });
      setFormData({
        name: "",
        price: "",
        quantity: "1",
        category: "",
        notes: "",
      });
      setIsOpen(false);
    }
  };

  const handleChange = (field: keyof ShoppingItem, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} />
          Adicionar Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item</DialogTitle>
          <DialogDescription>
            Adicione um item à sua lista de compras com preço e detalhes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Item *
            </label>
            <Input
              placeholder="Ex: Leite integral"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Preço (R$)
              </label>
              <div className="relative">
                <DollarSign
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Quantidade
              </label>
              <Input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <Input
              placeholder="Ex: Laticínios, Padaria, Limpeza"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Observações
            </label>
            <Input
              placeholder="Marca preferida, tamanho, etc."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 justify-between ">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
