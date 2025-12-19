"use client";

import { getEducations, createEducation, updateEducation, deleteEducation } from "@/lib/api";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useState } from "react";
import { TopHeader } from "@/components/top-header";

interface Education {
  id: string;
  school: string;
  major: string;
  degree: string;
  start_date: string;
  end_date: string;
  gpa?: string;
  logo_url?: string;
  logo_fit?: "contain" | "cover";
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

function SortableEducationItem({ education, onEdit, onDelete }: { education: Education; onEdit: (education: Education) => void; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: education.id });

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
            <h3 className="text-xl font-bold">{education.school}</h3>
            <p className="text-muted-foreground">
              {education.major} ({education.degree})
            </p>
            <p className="text-sm text-muted-foreground">
              {education.start_date} ~ {education.end_date}
            </p>
            {education.gpa && (
              <p className="text-sm text-muted-foreground">학점: {education.gpa}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(education)}
            className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            수정
          </button>
          <button
            onClick={() => onDelete(education.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EducationPage() {
  const { data: educations, loading, refetch } = useSupabaseData<Education[]>(getEducations, []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<Education, "id">>({
    school: "",
    major: "",
    degree: "",
    start_date: "",
    end_date: "",
    gpa: "",
    logo_url: "",
    logo_fit: "contain",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && educations) {
      const oldIndex = educations.findIndex((e) => e.id === active.id);
      const newIndex = educations.findIndex((e) => e.id === over.id);
      const reorderedEducations = arrayMove(educations, oldIndex, newIndex);

      // Update display_order for each education
      try {
        for (let i = 0; i < reorderedEducations.length; i++) {
          await updateEducation(reorderedEducations[i].id, {
            ...reorderedEducations[i],
            display_order: i,
          });
        }
        await refetch();
      } catch (error) {
        console.error("Failed to reorder educations:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateEducation(editingId, formData);
      } else {
        await createEducation(formData);
      }
      await refetch();
      resetForm();
      alert("저장되었습니다.");
    } catch (error) {
      console.error("Failed to save education:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      school: "",
      major: "",
      degree: "",
      start_date: "",
      end_date: "",
      gpa: "",
      logo_url: "",
      logo_fit: "contain",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (education: Education) => {
    setFormData(education);
    setEditingId(education.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        await deleteEducation(id);
        await refetch();
      } catch (error) {
        console.error("Failed to delete education:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return (
      <>
        <TopHeader title="학력" />
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
        title="학력"
        actions={
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {isEditing ? "목록으로" : "학력 추가"}
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
              <label className="block text-sm font-medium mb-2">학교명 *</label>
              <input
                type="text"
                required
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">로고 URL</label>
              <input
                type="url"
                value={formData.logo_url || ""}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">학교 로고 이미지 URL을 입력하세요</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">로고 표시 방식</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo_fit: "contain" })}
                  className={`px-4 py-2 rounded border transition-colors ${
                    formData.logo_fit === "contain"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
                  }`}
                >
                  전체 보기
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo_fit: "cover" })}
                  className={`px-4 py-2 rounded border transition-colors ${
                    formData.logo_fit === "cover"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-muted-foreground border-gray-300 hover:border-gray-400"
                  }`}
                >
                  영역 채우기
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">전공 *</label>
              <input
                type="text"
                required
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">학위 *</label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="예: 학사, 석사, 박사"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">입학일 *</label>
              <input
                type="month"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">졸업일 *</label>
              <input
                type="month"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          <div>
            <label className="block text-sm font-medium mb-2">학점</label>
            <input
              type="text"
              value={formData.gpa || ""}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="예: 4.0/4.5"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            {!educations || educations.length === 0 ? (
              <p className="text-muted-foreground">등록된 학력이 없습니다.</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={educations.map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {educations.map((education) => (
                      <SortableEducationItem
                        key={education.id}
                        education={education}
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
