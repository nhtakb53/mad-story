"use client";

import { useState, useEffect } from "react";
import { TopHeader } from "@/components/top-header";
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
import { getCareers, createCareer, updateCareer, deleteCareer } from "@/lib/api";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MonthPicker } from "@/components/ui/month-picker";

interface Career {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
  achievements: string[];
  logo_url?: string;
  logo_fit?: "contain" | "cover";
}

function SortableCareerItem({ career, onEdit, onDelete }: { career: Career; onEdit: (career: Career) => void; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: career.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            >
              <GripVertical size={20} />
            </Button>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{career.company}</h3>
              <p className="text-muted-foreground">{career.position}</p>
              <p className="text-sm text-muted-foreground">
                {career.start_date} ~ {career.current ? "현재" : career.end_date}
              </p>
              {career.description && <p className="mt-4">{career.description}</p>}
              {career.achievements && career.achievements.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">주요 성과:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {career.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(career)}
              variant="secondary"
              size="sm"
            >
              수정
            </Button>
            <Button
              onClick={() => onDelete(career.id)}
              variant="destructive"
              size="sm"
            >
              삭제
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CareerPage() {
  const { data: careers, loading, refetch } = useSupabaseData<Career[]>(getCareers, []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Career>>({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
    achievements: [],
    logo_url: "",
    logo_fit: "contain",
  });
  const [achievementInput, setAchievementInput] = useState("");
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && careers) {
      const oldIndex = careers.findIndex((c) => c.id === active.id);
      const newIndex = careers.findIndex((c) => c.id === over.id);
      const reorderedCareers = arrayMove(careers, oldIndex, newIndex);
      // TODO: 순서 저장 기능 추가
      await refetch();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateCareer(editingId, formData);
      } else {
        await createCareer(formData);
      }
      await refetch();
      resetForm();
      alert("저장되었습니다.");
    } catch (error) {
      console.error('Error saving career:', error);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
      achievements: [],
      logo_url: "",
      logo_fit: "contain",
    });
    setAchievementInput("");
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (career: Career) => {
    setFormData(career);
    setEditingId(career.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        await deleteCareer(id);
        await refetch();
      } catch (error) {
        console.error('Error deleting career:', error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData({
        ...formData,
        achievements: [...(formData.achievements || []), achievementInput.trim()],
      });
      setAchievementInput("");
    }
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements?.filter((_, i) => i !== index) || [],
    });
  };

  if (loading) {
    return (
      <>
        <TopHeader title="경력" />
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
        title="경력"
        actions={
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "목록으로" : "경력 추가"}
          </Button>
        }
      />
      <div className="pt-[65px] pl-64 print:pt-0 print:pl-0">
        <div className="p-8 flex justify-center">
          <div className="w-full max-w-2xl">

        {isEditing ? (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">회사명 *</label>
              <Input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">로고 URL</label>
              <Input
                type="url"
                value={formData.logo_url || ""}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://"
              />
              <p className="text-xs text-gray-500 mt-1">회사 로고 이미지 URL을 입력하세요</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">로고 표시 방식</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo_fit: "contain" })}
                  variant={formData.logo_fit === "contain" ? "default" : "outline"}
                >
                  전체 보기
                </Button>
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo_fit: "cover" })}
                  variant={formData.logo_fit === "cover" ? "default" : "outline"}
                >
                  영역 채우기
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">직책 *</label>
              <Input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">시작일 *</label>
              <MonthPicker
                value={formData.start_date}
                onChange={(value) => setFormData({ ...formData, start_date: value })}
                placeholder="시작일 선택"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">종료일</label>
              <MonthPicker
                value={formData.end_date}
                onChange={(value) => setFormData({ ...formData, end_date: value })}
                placeholder="종료일 선택"
                disabled={formData.current}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) =>
                  setFormData({ ...formData, current: e.target.checked, end_date: "" })
                }
                className="mr-2"
              />
              <label htmlFor="current" className="text-sm font-medium">
                현재 재직중
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">업무 설명</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">주요 성과</label>
              <p className="text-xs text-gray-500 mb-2">들여쓰기: 스페이스 2개로 1단계, 4개로 2단계 들여쓰기 가능</p>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                  placeholder="성과를 입력하고 추가 버튼을 누르세요"
                  className="font-mono"
                />
                <Button
                  type="button"
                  onClick={addAchievement}
                  variant="secondary"
                >
                  추가
                </Button>
              </div>
              <ul className="space-y-2">
                {formData.achievements?.map((achievement, index) => {
                  const indent = achievement.match(/^(\s*)/)?.[0].length || 0;
                  const level = Math.min(Math.floor(indent / 2), 2);
                  return (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded" style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}>
                      <span className="font-mono">{achievement}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                        className="text-red-500 hover:text-red-700 h-auto py-1"
                      >
                        삭제
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? "저장 중..." : (editingId ? "수정" : "저장")}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="secondary"
                >
                  취소
                </Button>
              )}
            </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {!careers || careers.length === 0 ? (
              <p className="text-muted-foreground">등록된 경력이 없습니다.</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={careers.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {careers.map((career) => (
                      <SortableCareerItem
                        key={career.id}
                        career={career}
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
