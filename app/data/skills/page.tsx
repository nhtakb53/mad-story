"use client";

import { useFileStorage } from "@/hooks/useFileStorage";
import { Skill } from "@/types/resume";
import { useState } from "react";

export default function SkillsPage() {
  const [skills, saveSkills, loading] = useFileStorage<Skill[]>("skills", []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Skill, "id">>({
    category: "",
    name: "",
    level: 2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedSkills;
    if (editingId) {
      updatedSkills = skills.map((s) => (s.id === editingId ? { ...formData, id: editingId } : s));
    } else {
      updatedSkills = [...skills, { ...formData, id: Date.now().toString() }];
    }
    const success = await saveSkills(updatedSkills);
    if (success) {
      resetForm();
      alert("저장되었습니다.");
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  const resetForm = () => {
    setFormData({ category: "", name: "", level: 2 });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setEditingId(skill.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("삭제하시겠습니까?")) {
      const updatedSkills = skills.filter((s) => s.id !== id);
      await saveSkills(updatedSkills);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">보유기술</h1>

        <div className="mb-8">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {isEditing ? "목록으로" : "기술 추가"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">카테고리 *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="예: 프로그래밍 언어, 프레임워크, 데이터베이스 등"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">기술명 *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: JavaScript, React, MySQL 등"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">숙련도 *</label>
              <select
                required
                value={formData.level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    level: Number(e.target.value) as Skill["level"],
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={1}>1 - 기본적인 사용 경험과 협업에 필요한 지식 보유</option>
                <option value={2}>2 - 매우 능숙하지는 않지만 업무 수행 가능</option>
                <option value={3}>3 - 관련 지식과 경험이 풍부하며 능숙하게 업무 진행 가능</option>
              </select>
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
          <div className="space-y-6">
            {Object.keys(groupedSkills).length === 0 ? (
              <p className="text-muted-foreground">등록된 기술이 없습니다.</p>
            ) : (
              Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category} className="border p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">{category}</h3>
                  <div className="space-y-2">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                      >
                        <div>
                          <span className="font-medium">{skill.name}</span>
                          <span className="ml-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {skill.level}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
