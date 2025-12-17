"use client";

import { useFileStorage } from "@/hooks/useFileStorage";
import { Career } from "@/types/resume";
import { useState } from "react";

export default function CareerPage() {
  const [careers, saveCareers, loading] = useFileStorage<Career[]>("careers", []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Career, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: [],
  });
  const [achievementInput, setAchievementInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedCareers;
    if (editingId) {
      updatedCareers = careers.map((c) => (c.id === editingId ? { ...formData, id: editingId } : c));
    } else {
      updatedCareers = [...careers, { ...formData, id: Date.now().toString() }];
    }
    const success = await saveCareers(updatedCareers);
    if (success) {
      resetForm();
      alert("저장되었습니다.");
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
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
      const updatedCareers = careers.filter((c) => c.id !== id);
      await saveCareers(updatedCareers);
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, achievementInput.trim()],
      });
      setAchievementInput("");
    }
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">경력</h1>

        <div className="mb-8">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {isEditing ? "목록으로" : "경력 추가"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">회사명 *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">직책 *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">시작일 *</label>
              <input
                type="month"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">종료일</label>
              <input
                type="month"
                value={formData.endDate}
                disabled={formData.current}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              />
            </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={(e) =>
                setFormData({ ...formData, current: e.target.checked, endDate: "" })
              }
              className="mr-2"
            />
            <label htmlFor="current" className="text-sm font-medium">
              현재 재직중
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">업무 설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">주요 성과</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                placeholder="성과를 입력하고 추가 버튼을 누르세요"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={addAchievement}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
              >
                추가
              </button>
            </div>
            <ul className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{achievement}</span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
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
            {careers.length === 0 ? (
              <p className="text-muted-foreground">등록된 경력이 없습니다.</p>
            ) : (
              careers.map((career) => (
                <div key={career.id} className="border p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{career.company}</h3>
                      <p className="text-muted-foreground">{career.position}</p>
                      <p className="text-sm text-muted-foreground">
                        {career.startDate} ~ {career.current ? "현재" : career.endDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(career)}
                        className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(career.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  {career.description && <p className="mb-4">{career.description}</p>}
                  {career.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">주요 성과:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {career.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
