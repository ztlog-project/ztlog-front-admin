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
          const postData = contentRes.data;
          setPost(postData);
          setTitle(postData.title || '');
          setBody((postData as any).body || postData.content || '');
          if ((postData as any).tags) {
            setSelectedTags((postData as any).tags.map((t: any) => t.tagNo));
          }
        }

        if ((tagsRes as any).list) {
          setAllTags((tagsRes as any).list);
        } else if (tagsRes.data && Array.isArray((tagsRes.data as any).content)) {
          setAllTags((tagsRes.data as any).content);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [ctntNo]);

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
      await contentsApi.update({
        ctntNo,
        title: title.trim(),
        body: body,
        tags: selectedTags.map((tagNo) => ({ tagNo })),
      } as any);
      router.push('/admin/posts');
    } catch (e: any) {
      setError(e.message || '수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-light">로딩 중...</div>
      </div>
    );
  }

  if (!post && error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger text-lg mb-4">{error}</p>
        <Link href="/admin/posts" className="text-primary hover:text-primary-hover">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-text-light text-lg">게시물을 찾을 수 없습니다.</p>
        <Link href="/admin/posts" className="text-primary hover:text-primary-hover mt-4 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">게시물 수정</h1>
          <p className="text-sm text-text-light mt-1">게시물 ID: {ctntNo}</p>
        </div>
        <Link
          href="/admin/posts"
          className="text-sm text-text-light hover:text-text transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          목록으로
        </Link>
      </div>

      {error && <div className="mb-6 p-3 bg-danger/10 text-danger text-sm rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
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
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">태그</h3>

              {allTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
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
                <p className="text-sm text-text-light mb-4">등록된 태그가 없습니다.</p>
              )}

              {/* Post Info */}
              <div className="mb-6 p-3 bg-bg rounded-lg">
                <div className="flex justify-between text-xs text-text-light mb-1">
                  <span>작성자</span>
                  <span>{post.inpUser || '-'}</span>
                </div>
                <div className="flex justify-between text-xs text-text-light mb-1">
                  <span>작성일</span>
                  <span>{post.inpDttm ? new Date(post.inpDttm).toLocaleDateString('ko-KR') : '-'}</span>
                </div>
                <div className="flex justify-between text-xs text-text-light">
                  <span>수정일</span>
                  <span>{post.updDttm ? new Date(post.updDttm).toLocaleDateString('ko-KR') : '-'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium text-sm
                    hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {saving ? '수정 중...' : '수정'}
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
