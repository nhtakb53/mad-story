"use client";

import { useFileStorage } from "@/hooks/useFileStorage";
import { BasicInfo } from "@/types/resume";
import { useState, useEffect } from "react";

export default function BasicInfoPage() {
  const [data, saveData, loading] = useFileStorage<BasicInfo>("basic-info", {
    name: "",
    nameEn: "",
    email: "",
    phone: "",
    github: "",
    blog: "",
    linkedin: "",
    introduce: "",
    profileImage: "",
  });

  const [formData, setFormData] = useState<BasicInfo>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveData(formData);
    if (success) {
      alert("저장되었습니다.");
    } else {
      alert("저장에 실패했습니다.");
    }
  };

  const handleChange = (field: keyof BasicInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-4">기본사항</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">이름 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">영문 이름</label>
            <input
              type="text"
              value={formData.nameEn || ""}
              onChange={(e) => handleChange("nameEn", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">이메일 *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">전화번호 *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">GitHub</label>
            <input
              type="url"
              value={formData.github || ""}
              onChange={(e) => handleChange("github", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">블로그</label>
            <input
              type="url"
              value={formData.blog || ""}
              onChange={(e) => handleChange("blog", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">자기소개</label>
          <textarea
            value={formData.introduce || ""}
            onChange={(e) => handleChange("introduce", e.target.value)}
            rows={4}
            placeholder="INTRODUCE 섹션에 표시될 자기소개를 입력하세요"
            className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">프로필 이미지 URL</label>
          <input
            type="url"
            value={formData.profileImage || ""}
            onChange={(e) => handleChange("profileImage", e.target.value)}
            placeholder="https://example.com/profile.jpg"
            className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          저장
        </button>
      </form>
    </div>
  );
}
