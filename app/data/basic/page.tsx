"use client";

import { useFileStorage } from "@/hooks/useFileStorage";
import { BasicInfo } from "@/types/resume";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function BasicInfoPage() {
  const [data, saveData, loading] = useFileStorage<BasicInfo>("basic-info", {
    name: "",
    nameEn: "",
    nickname: "",
    email: "",
    phone: "",
    github: "",
    blog: "",
    linkedin: "",
    introduce: "",
    profileImage: "",
    tags: [],
  });

  const [formData, setFormData] = useState<BasicInfo>(data);
  const [tagInput, setTagInput] = useState("");

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">기본사항</h1>
        <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">이름 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">영문 이름</label>
            <input
              type="text"
              value={formData.nameEn || ""}
              onChange={(e) => handleChange("nameEn", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">닉네임</label>
            <input
              type="text"
              value={formData.nickname || ""}
              onChange={(e) => handleChange("nickname", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">이메일 *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">전화번호 *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub</label>
            <input
              type="url"
              value={formData.github || ""}
              onChange={(e) => handleChange("github", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">블로그</label>
            <input
              type="url"
              value={formData.blog || ""}
              onChange={(e) => handleChange("blog", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">자기소개</label>
            <textarea
              value={formData.introduce || ""}
              onChange={(e) => handleChange("introduce", e.target.value)}
              rows={4}
              placeholder="자기소개를 입력하세요. 강조하고 싶은 키워드는 **키워드** 형식으로 입력하세요."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              예시: 저는 **사용자 경험**을 중시하는 **프론트엔드 개발자**입니다.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">나를 표현하는 태그</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="태그를 입력하고 추가 버튼을 누르세요"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">프로필 이미지</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">파일 업로드</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">또는 URL 입력</label>
                <input
                  type="text"
                  value={formData.profileImage || ""}
                  onChange={(e) => handleChange("profileImage", e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {formData.profileImage && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">미리보기</p>
                  <img
                    src={formData.profileImage}
                    alt="프로필 이미지 미리보기"
                    className="w-32 h-32 object-cover border rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            저장
          </button>
        </form>
      </div>
    </div>
  );
}
