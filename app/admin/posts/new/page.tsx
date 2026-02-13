'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { contentsApi } from '@/lib/api/contents';
import { tagsApi } from '@/lib/api/tags';
import { Tag } from '@/lib/api/types';
import TipTapEditor from '@/components/TipTapEditor';

export default function PostCreatePage() {
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const plain = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    setSubTitle(plain.slice(0, 100));
  }, [body]);

  useEffect(() => {
    async function loadTags() {
      try {
        const res = await tagsApi.getList(1);
        if ((res as any).list) {
          setAllTags((res as any).list);
        } else if (res.data && Array.isArray((res.data as any).content)) {
          setAllTags((res.data as any).content);
        }
      } catch (e) {
        // 태그 목록 로딩 실패는 무시
      }
    }
    loadTags();
  }, []);

  function toggleTag(tagNo: number) {
    if (selectedTags.includes(tagNo)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagNo));
    } else {
      setSelectedTags([...selectedTags, tagNo]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const data = {
        title: title.trim(),
        subTitle: subTitle.trim(),
        body: body,
        tags: selectedTags.map((tagNo) => ({ tagNo })),
      };
      await contentsApi.create(data);
      router.push('/admin/posts');
    } catch (e: any) {
      setError(e.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">새 글 작성</h1>
          <p className="mt-1 text-sm text-text-light">새로운 블로그 게시물을 작성합니다</p>
        </div>
        <Link
          href="/admin/posts"
          className="flex items-center gap-1 text-sm transition-colors text-text-light hover:text-text"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          목록으로
        </Link>
      </div>

      {error && <div className="p-3 mb-6 text-sm rounded-lg bg-danger/10 text-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 xl:col-span-2">
            <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
              <div className="mb-5">
                <label htmlFor="title" className="block text-sm font-medium text-text mb-1.5">
                  제목
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="게시물 제목을 입력하세요"
                  maxLength={100}
                  required
                  disabled={saving}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors
                    disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  내용
                </label>
                <TipTapEditor
                  value={body}
                  onChange={setBody}
                  disabled={saving}
                  placeholder="게시물 내용을 입력하세요..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="p-6 border rounded-lg shadow-sm bg-card border-border">
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-text">태그</h3>

              {allTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-6">
                  {allTags.map((tag) => (
                    <button
                      key={tag.tagNo}
                      type="button"
                      onClick={() => toggleTag(tag.tagNo)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                        ${selectedTags.includes(tag.tagNo) ? 'bg-primary text-white' : 'bg-bg text-text-light hover:bg-border'}`}
                    >
                      {tag.tagName}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mb-6 text-sm text-text-light">등록된 태그가 없습니다.</p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium text-sm
                    hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {saving ? '저장 중...' : '저장'}
                </button>
                <Link
                  href="/admin/posts"
                  className="flex-1 py-2.5 bg-bg text-text-light rounded-lg font-medium text-sm text-center
                    hover:bg-border transition-colors flex items-center justify-center"
                >
                  취소
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
