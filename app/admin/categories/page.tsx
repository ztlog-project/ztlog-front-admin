'use client';

import { useEffect, useState, FormEvent } from 'react';
import { tagsApi } from '@/lib/api/tags';
import { Tag } from '@/lib/api/types';

export default function CategoriesPage() {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadTags() {
    setLoading(true);
    setError('');
    try {
      const res = await tagsApi.getList(1);
      if ((res as any).list) {
        setTagList((res as any).list);
      } else if (res.data && Array.isArray((res.data as any).content)) {
        setTagList((res.data as any).content);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTags();
  }, []);

  async function addTag(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await tagsApi.create({ tagName: newName.trim() });
      setNewName('');
      await loadTags();
    } catch (e: any) {
      alert('태그 추가 실패: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.tagNo);
    setEditName(tag.tagName);
  }

  async function saveEdit(tagNo: number) {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await tagsApi.update({ tagNo, tagName: editName.trim() });
      setEditingId(null);
      await loadTags();
    } catch (e: any) {
      alert('태그 수정 실패: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function deleteTag(tagNo: number) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await tagsApi.delete(tagNo);
      await loadTags();
    } catch (e: any) {
      alert('태그 삭제 실패: ' + e.message);
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">태그 관리</h1>
        <p className="text-sm text-text-light mt-1">블로그 태그를 추가, 수정, 삭제합니다</p>
      </div>

      {/* Add Tag */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
        <h2 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">새 태그 추가</h2>
        <form onSubmit={addTag} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="태그 이름 (최대 15자)"
            maxLength={15}
            required
            disabled={saving}
            className="px-4 py-2.5 border border-border rounded-lg text-sm text-text bg-white flex-1
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors
              disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium
              hover:bg-primary-hover transition-colors flex-shrink-0 inline-flex items-center gap-2
              disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            추가
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-text-light">로딩 중...</div>
        </div>
      ) : error ? (
        <div className="p-4 bg-danger/10 text-danger text-sm rounded-lg">{error}</div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-10">
                    #
                  </th>
                  <th className="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">
                    이름
                  </th>
                  <th className="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-24">
                    게시물 수
                  </th>
                  <th className="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3">
                    생성일
                  </th>
                  <th className="text-left text-xs font-medium text-text-light uppercase tracking-wider px-6 py-3 w-28">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody>
                {tagList.map((tag, i) => (
                  <tr key={tag.tagNo} className="border-b border-border last:border-b-0 hover:bg-bg/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm text-text-light">{i + 1}</td>
                    <td className="px-6 py-3.5">
                      {editingId === tag.tagNo ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          maxLength={15}
                          className="px-3 py-1.5 border border-primary rounded text-sm text-text bg-white w-full
                            focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        <span className="text-sm text-text font-medium">{tag.tagName}</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {(tag as any).contents?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-text-light">
                      {(tag as any).inpDttm ? new Date((tag as any).inpDttm).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        {editingId === tag.tagNo ? (
                          <>
                            <button
                              onClick={() => saveEdit(tag.tagNo)}
                              disabled={saving}
                              className="p-1.5 text-success hover:bg-success/10 transition-colors rounded-lg disabled:opacity-50"
                              title="저장"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 text-text-light hover:bg-bg transition-colors rounded-lg"
                              title="취소"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(tag)}
                              className="p-1.5 text-text-light hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                              title="수정"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteTag(tag.tagNo)}
                              className="p-1.5 text-text-light hover:text-danger transition-colors rounded-lg hover:bg-danger/10"
                              title="삭제"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tagList.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-text-light">등록된 태그가 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
