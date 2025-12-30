"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getBasicInfo, updateBasicInfo } from "@/lib/api";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { TopHeader } from "@/components/top-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfo {
  name: string;
  name_en?: string;
  nickname?: string;
  email: string;
  phone: string;
  github?: string;
  blog?: string;
  linkedin?: string;
  introduce?: string;
  profile_image?: string;
  tags?: string[];
}

const defaultBasicInfo: BasicInfo = {
  name: "",
  name_en: "",
  nickname: "",
  email: "",
  phone: "",
  github: "",
  blog: "",
  linkedin: "",
  introduce: "",
  profile_image: "",
  tags: [],
};

export default function BasicInfoPage() {
  const { data, loading, refetch } = useSupabaseData<BasicInfo>(getBasicInfo, []);

  const [formData, setFormData] = useState<BasicInfo>(defaultBasicInfo);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBasicInfo(formData);
      await refetch();
      alert("저장되었습니다.");
    } catch (error) {
      console.error('Error saving basic info:', error);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
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
        setFormData((prev) => ({ ...prev, profile_image: reader.result as string }));
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
    return (
      <>
        <TopHeader title="기본사항" />
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
      <TopHeader title="기본사항" />
      <div className="pt-[65px] pl-64 print:pt-0 print:pl-0">
        <div className="p-8 flex justify-center">
          <div className="w-full max-w-2xl">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">이름 *</label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">영문 이름</label>
            <Input
              type="text"
              value={formData.name_en || ""}
              onChange={(e) => handleChange("name_en", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">닉네임</label>
            <Input
              type="text"
              value={formData.nickname || ""}
              onChange={(e) => handleChange("nickname", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">이메일 *</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">전화번호 *</label>
            <Input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub</label>
            <Input
              type="url"
              value={formData.github || ""}
              onChange={(e) => handleChange("github", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">블로그</label>
            <Input
              type="url"
              value={formData.blog || ""}
              onChange={(e) => handleChange("blog", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <Input
              type="url"
              value={formData.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">자기소개</label>
            <Textarea
              value={formData.introduce || ""}
              onChange={(e) => handleChange("introduce", e.target.value)}
              rows={4}
              placeholder="자기소개를 입력하세요. 강조하고 싶은 키워드는 **키워드** 형식으로 입력하세요."
            />
            <p className="text-xs text-gray-500 mt-1">
              예시: 저는 **사용자 경험**을 중시하는 **프론트엔드 개발자**입니다.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">나를 표현하는 태그</label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="태그를 입력하고 추가 버튼을 누르세요"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="secondary"
              >
                추가
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </Badge>
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
                <Input
                  type="text"
                  value={formData.profile_image || ""}
                  onChange={(e) => handleChange("profile_image", e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>
              {formData.profile_image && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">미리보기</p>
                  <img
                    src={formData.profile_image}
                    alt="프로필 이미지 미리보기"
                    className="w-32 h-32 object-cover border rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? "저장 중..." : "저장"}
          </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
