"use client";

import { getProjects, createProject, updateProject, deleteProject } from "@/lib/api";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useState } from "react";
import { TopHeader } from "@/components/top-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MonthPicker } from "@/components/ui/month-picker";

interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  role: string;
  tech_stack: string[];
  achievements: string[];
  url?: string;
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

function SortableProjectItem({ project, onEdit, onDelete }: { project: Project; onEdit: (project: Project) => void; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

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
        <div className="flex justify-between items-start mb-4">
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
            <h3 className="text-xl font-bold">{project.name}</h3>
            <p className="text-muted-foreground">{project.role}</p>
            <p className="text-sm text-muted-foreground">
              {project.start_date} ~ {project.end_date}
            </p>
            {project.description && <p className="mt-4">{project.description}</p>}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">기술스택:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {project.achievements && project.achievements.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">주요 성과:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {project.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.url && (
              <p className="mt-4 text-sm text-blue-600">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {project.url}
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(project)}
          >
            수정
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(project.id)}
          >
            삭제
          </Button>
        </div>
      </div>
    </CardContent>
    </Card>
  );
}

export default function ProjectsPage() {
  const { data: projects, loading, refetch } = useSupabaseData<Project[]>(getProjects, []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    role: "",
    tech_stack: [],
    achievements: [],
    url: "",
    logo_url: "",
    logo_fit: "contain",
  });
  const [techInput, setTechInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && projects) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      const reorderedProjects = arrayMove(projects, oldIndex, newIndex);

      // Update display_order for each project
      try {
        for (let i = 0; i < reorderedProjects.length; i++) {
          await updateProject(reorderedProjects[i].id, {
            ...reorderedProjects[i],
            display_order: i,
          });
        }
        await refetch();
      } catch (error) {
        console.error("Failed to reorder projects:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await createProject(formData);
      }
      await refetch();
      resetForm();
      alert("저장되었습니다.");
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      role: "",
      tech_stack: [],
      achievements: [],
      url: "",
      logo_url: "",
      logo_fit: "contain",
    });
    setTechInput("");
    setAchievementInput("");
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      ...project,
      tech_stack: project.tech_stack || [],
      achievements: project.achievements || [],
    });
    setEditingId(project.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        await deleteProject(id);
        await refetch();
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const addTech = () => {
    const tech_stack = formData.tech_stack || [];
    if (techInput.trim() && !tech_stack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...tech_stack, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    const tech_stack = formData.tech_stack || [];
    setFormData({
      ...formData,
      tech_stack: tech_stack.filter((t) => t !== tech),
    });
  };

  const addAchievement = () => {
    const achievements = formData.achievements || [];
    if (achievementInput.trim()) {
      setFormData({
        ...formData,
        achievements: [...achievements, achievementInput.trim()],
      });
      setAchievementInput("");
    }
  };

  const removeAchievement = (index: number) => {
    const achievements = formData.achievements || [];
    setFormData({
      ...formData,
      achievements: achievements.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <>
        <TopHeader title="프로젝트" />
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
        title="프로젝트"
        actions={
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "목록으로" : "프로젝트 추가"}
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
            {saving && <div className="text-sm text-gray-600">저장 중...</div>}
            <div>
              <label className="block text-sm font-medium mb-2">프로젝트명 *</label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <p className="text-xs text-gray-500 mt-1">프로젝트 로고 이미지 URL을 입력하세요</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">로고 표시 방식</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.logo_fit === "contain" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, logo_fit: "contain" })}
                >
                  전체 보기
                </Button>
                <Button
                  type="button"
                  variant={formData.logo_fit === "cover" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, logo_fit: "cover" })}
                >
                  영역 채우기
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">프로젝트 설명 *</label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
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
              <label className="block text-sm font-medium mb-2">종료일 *</label>
              <MonthPicker
                value={formData.end_date}
                onChange={(value) => setFormData({ ...formData, end_date: value })}
                placeholder="종료일 선택"
                required
              />
            </div>
          <div>
            <label className="block text-sm font-medium mb-2">역할 *</label>
            <Input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="예: Frontend Developer, Full Stack Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">기술 스택</label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                placeholder="기술을 입력하고 추가 버튼을 누르세요"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addTech}
              >
                추가
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.tech_stack || []).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="inline-flex items-center gap-1 pr-1"
                >
                  {tech}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTech(tech)}
                    className="h-4 w-4 p-0 text-red-500 hover:text-red-700 hover:bg-transparent"
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
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
                variant="secondary"
                onClick={addAchievement}
              >
                추가
              </Button>
            </div>
            <ul className="space-y-2">
              {(formData.achievements || []).map((achievement, index) => {
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
          <div>
            <label className="block text-sm font-medium mb-2">프로젝트 URL</label>
            <Input
              type="url"
              value={formData.url || ""}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              {editingId ? "수정" : "저장"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
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
            {!projects || projects.length === 0 ? (
              <p className="text-muted-foreground">등록된 프로젝트가 없습니다.</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={projects.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <SortableProjectItem
                        key={project.id}
                        project={project}
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
