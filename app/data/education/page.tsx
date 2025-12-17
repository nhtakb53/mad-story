"use client";

import { useFileStorage } from "@/hooks/useFileStorage";
import { Education } from "@/types/resume";
import { useState } from "react";

export default function EducationPage() {
  const [educations, saveEducations, loading] = useFileStorage<Education[]>("educations", []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Education, "id">>({
    school: "",
    major: "",
    degree: "",
    startDate: "",
    endDate: "",
    gpa: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedEducations;
    if (editingId) {
      updatedEducations = educations.map((ed) => (ed.id === editingId ? { ...formData, id: editingId } : ed));
    } else {
      updatedEducations = [...educations, { ...formData, id: Date.now().toString() }];
    }
    const success = await saveEducations(updatedEducations);
    if (success) {
      resetForm();
      alert("저장되었습니다.");
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  const resetForm = () => {
    setFormData({
      school: "",
      major: "",
      degree: "",
      startDate: "",
      endDate: "",
      gpa: "",
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
      const updatedEducations = educations.filter((ed) => ed.id !== id);
      await saveEducations(updatedEducations);
    }
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">학력</h1>

        <div className="mb-8">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {isEditing ? "목록으로" : "학력 추가"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg">
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
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">졸업일 *</label>
              <input
                type="month"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
            {educations.length === 0 ? (
              <p className="text-muted-foreground">등록된 학력이 없습니다.</p>
            ) : (
              educations.map((education) => (
                <div key={education.id} className="border p-6 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{education.school}</h3>
                      <p className="text-muted-foreground">
                        {education.major} ({education.degree})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {education.startDate} ~ {education.endDate}
                      </p>
                      {education.gpa && (
                        <p className="text-sm text-muted-foreground">학점: {education.gpa}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(education)}
                        className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(education.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
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
