"use client";

import { getOtherItems, createOtherItem, updateOtherItem, deleteOtherItem } from "@/lib/api";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useState } from "react";
import { TopHeader } from "@/components/top-header";

interface OtherItem {
  id: string;
  title: string;
  category: string;
  organization?: string;
  date?: string;
  description?: string;
  display_order?: number;
}

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// 공통 카테고리 제안
const COMMON_CATEGORIES = [
  '논문',
  '자격증',
  '수상',
  '특허',
  '출판',
  '강연',
  '봉사활동',
  '어학',
  '기타'
];

function SortableOtherItem({ item, onEdit, onDelete }: { item: OtherItem; onEdit: (item: OtherItem) => void; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border p-6 rounded-lg bg-white"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                {item.category}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1">{item.title}</h3>
            {item.organization && (
              <p className="text-muted-foreground text-sm mb-1">{item.organization}</p>
            )}
            {item.date && (
              <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
            )}
            {item.description && (
              <p className="mt-2 text-sm whitespace-pre-wrap">{item.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            수정
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OtherItemsPage() {
  const { data: otherItems, loading, refetch } = useSupabaseData<OtherItem[]>(getOtherItems, []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<OtherItem, "id">>({
    title: "",
    category: "",
    organization: "",
    date: "",
    description: "",
    display_order: 0,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && otherItems) {
      const oldIndex = otherItems.findIndex((e) => e.id === active.id);
      const newIndex = otherItems.findIndex((e) => e.id === over.id);
      const reorderedItems = arrayMove(otherItems, oldIndex, newIndex);

      // Update display_order for each item
      try {
        for (let i = 0; i < reorderedItems.length; i++) {
          await updateOtherItem(reorderedItems[i].id, {
            ...reorderedItems[i],
            display_order: i,
          });
        }
        await refetch();
      } catch (error) {
        console.error("Failed to reorder items:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateOtherItem(editingId, formData);
      } else {
        await createOtherItem(formData);
      }
      await refetch();
      resetForm();
      alert("저장되었습니다.");
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      organization: "",
      date: "",
      description: "",
      display_order: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (item: OtherItem) => {
    setFormData(item);
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        await deleteOtherItem(id);
        await refetch();
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return (
      <>
        <TopHeader title="기타 사항" />
        <div className="pt-[65px] pl-64 print:pt-0 print:pl-0">
          <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopHeader
        title="기타 사항"
        actions={
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {isEditing ? "목록으로" : "항목 추가"}
          </button>
        }
      />
      <div className="pt-[65px] pl-64 print:pt-0 print:pl-0">
        <div className="p-8 flex justify-center">
          <div className="w-full max-w-2xl">

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg">
            {saving && <div className="text-sm text-gray-600">저장 중...</div>}
            <div>
              <label className="block text-sm font-medium mb-2">카테고리/타입 *</label>
              <input
                type="text"
                list="category-suggestions"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="예: 논문, 자격증, 수상 등"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <datalist id="category-suggestions">
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <p className="text-xs text-gray-500 mt-1">
                제안된 카테고리를 선택하거나 직접 입력하세요
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">제목 *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="예: 논문명, 자격증명, 수상명 등"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">발행/주최 기관</label>
              <input
                type="text"
                value={formData.organization || ""}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="예: 한국정보처리학회, 과학기술정보통신부 등"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">취득/발표일</label>
              <input
                type="month"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">설명/상세 내용</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="추가 설명이나 성과를 입력하세요"
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              {editingId ? "수정" : "저장"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
              >
                취소
              </button>
            )}
          </div>
        </form>
        ) : (
          <div className="space-y-4">
            {!otherItems || otherItems.length === 0 ? (
              <p className="text-muted-foreground">등록된 항목이 없습니다.</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={otherItems.map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {otherItems.map((item) => (
                      <SortableOtherItem
                        key={item.id}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}
          </div>
        </div>
      </div>
    </>
  );
}
