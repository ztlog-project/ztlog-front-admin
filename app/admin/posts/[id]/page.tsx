'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { contentsApi } from '@/lib/api/contents';
import { tagsApi } from '@/lib/api/tags';
import { Content, Tag } from '@/lib/api/types';
import TipTapEditor from '@/components/TipTapEditor';

export default function PostEditPage() {
  const params = useParams();
  const router = useRouter();
  const ctntNo = parseInt(params.id as string);

  const [post, setPost] = useState<Content | null>(null);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [contentRes, tagsRes] = await Promise.all([
          contentsApi.getDetail(ctntNo),
          tagsApi.getList(1),
        ]);

        if (contentRes.data) {
          const postData = contentRes.data as any;
          setPost(postData);
          setTitle(postData.title || '');
          const bodyContent = postData.body || postData.content || '';
          setBody(bodyContent);
          const subTitleValue = postData.subTitle ||
            bodyContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
          setSubTitle(subTitleValue);
          if (postData.tags) {
            setSelectedTags(postData.tags.map((t: any) => t.tagNo));
          }
        }

        const tagList = (tagsRes as any).list || (tagsRes.data as any)?.content || [];
        setAllTags(tagList);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [ctntNo]);

  /**
   * TipTapEditor의 onChange에서 HTML과 함께 순수 텍스트를 받는 방식
   * 만약 컴포넌트 수정이 어렵다면 아래 useEffect에서 텍스트를 추출합니다.
   */
  const handleBodyChange = (html: string, plainText?: string) => {
    setBody(html);
    // TipTap의 getText() 결과물이 넘어온다면 바로 사용, 없으면 직접 추출
    const finalPlainText = plainText || html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    setSubTitle(finalPlainText.slice(0, 100));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      await contentsApi.update({
        ctntNo,
        title: title.trim(),
        subTitle,
        body,
        tags: selectedTags.map((tagNo) => ({ tagNo })),
      } as any);
      router.push('/admin/posts');
    } catch (e: any) {
      setError(e.message || '수정 중 오류가 발생했습니다.');
      setSaving(false);
    }
  }

  if (loading) return <div className="py-20 text-center text-text-light">로딩 중...</div>;
  if (!post) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">게시물 수정 (ID: {ctntNo})</h1>
        <Link href="/admin/posts" className="text-sm text-text-light hover:underline">목록으로</Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1.5">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none border-border focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">내용</label>
              <TipTapEditor 
                value={body} 
                onChange={handleBodyChange} // 수정된 핸들러 연결
                disabled={saving} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
            <h3 className="mb-4 text-sm font-semibold">태그 설정</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {allTags.map((tag) => (
                <button
                  key={tag.tagNo}
                  type="button"
                  onClick={() => setSelectedTags(prev => 
                    prev.includes(tag.tagNo) ? prev.filter(t => t !== tag.tagNo) : [...prev, tag.tagNo]
                  )}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag.tagNo) ? 'bg-primary text-white' : 'bg-bg text-text-light'
                  }`}
                >
                  {tag.tagName}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50"
            >
              {saving ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
