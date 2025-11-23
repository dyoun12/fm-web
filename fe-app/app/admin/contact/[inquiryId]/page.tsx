"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "../../../components/atoms/card/card";
import { TextArea } from "../../../components/atoms/text-area/text-area";
import { Button } from "../../../components/atoms/button/button";
import { Select } from "../../../components/atoms/select/select";
import { Tooltip } from "../../../components/atoms/tooltip/tooltip";
import { Skeleton } from "../../../components/atoms/skeleton/skeleton";
import { AsyncSection } from "../../../components/molecules/async-section/async-section";
import type { ContactInquiry } from "@/api/contact";

function AdminContactDetailSkeleton() {
  return (
    <div className="grid gap-4">
      {/* 메타 정보 스켈레톤 */}
      <Card padding="lg">
        <div className="flex flex-col gap-3">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="rect" className="h-10 w-full" />
        </div>
      </Card>

      {/* 문의 내용 + 1차 답변 스켈레톤 (2열 구성) */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="lg">
          <div className="flex flex-col gap-3">
            <Skeleton variant="text" className="h-5 w-24" />
            <Skeleton variant="rect" className="h-24 w-full" />
          </div>
        </Card>
        <Card padding="lg">
          <div className="flex flex-col gap-3">
            <Skeleton variant="text" className="h-5 w-20" />
            <Skeleton variant="rect" className="h-24 w-full" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AdminContactDetailPage() {
  const params = useParams();
  const inquiryId = typeof params?.inquiryId === "string" ? params.inquiryId : "";

  const [inquiry, setInquiry] = useState<ContactInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("new");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (!inquiryId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/contact/${inquiryId}`);
        const json = await r.json();
        if (!json || json.success !== true) {
          throw new Error(json?.error?.message ?? "문의 정보를 불러오지 못했습니다.");
        }
        const data = json.data as ContactInquiry;
        if (!mounted) return;
        setInquiry(data);
        setStatus(data.status ?? "new");
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "문의 정보를 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [inquiryId]);

  useEffect(() => {
    if (!inquiry) return;
    setStatus(inquiry.status ?? "new");
    setStatusError(null);
  }, [inquiry]);

  const handleSendReply = async () => {
    if (!inquiry || !reply.trim()) return;
    setSending(true);
    setSendError(null);
    setSendSuccess(null);
    try {
      const r = await fetch(`/api/contact/${inquiry.inquiryId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: reply.trim() }),
      });
      const json = await r.json();
      if (!json || json.success !== true) {
        throw new Error(json?.error?.message ?? "답변 발송 처리에 실패했습니다.");
      }
      const updated = json.data as ContactInquiry;
      setInquiry(updated);
      setSendSuccess("이메일 답변이 발송되었다고 기록했습니다.");
      setReply("");
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "답변 발송 처리에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (nextStatus: string) => {
    if (!inquiry || nextStatus === inquiry.status) {
      return;
    }
    setStatusUpdating(true);
    setStatusError(null);
    try {
      const r = await fetch(`/api/contact/${inquiry.inquiryId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await r.json();
      if (!json || json.success !== true) {
        throw new Error(json?.error?.message ?? "문의 상태를 업데이트하지 못했습니다.");
      }
      const updated = json.data as ContactInquiry;
      setInquiry(updated);
      setStatus(updated.status ?? nextStatus);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "문의 상태를 업데이트하지 못했습니다.");
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!inquiryId) {
    return <p className="text-sm text-red-600">유효하지 않은 문의 ID입니다.</p>;
  }

  if (loading || error || !inquiry) {
    return (
      <AsyncSection
        status={loading ? "loading" : "error"}
        title="문의 상세 정보를 불러오는 중입니다."
        message={loading ? "잠시만 기다려 주세요." : undefined}
        errorMessage={error ?? (!inquiry ? "문의 정보를 찾을 수 없습니다." : null)}
        skeleton={loading ? <AdminContactDetailSkeleton /> : undefined}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {/* 메타 정보 */}
      <Card padding="lg">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">문의 메타 정보</h2>
            <Select
              id="contact-status-select"
              aria-label="문의 상태"
              size="sm"
              variant="badge"
              className="min-w-[160px] justify-end"
              options={[
                { label: "신규", value: "new", badgeColor: "warning" },
                { label: "처리 중", value: "in_progress", badgeColor: "info" },
                { label: "완료", value: "done", badgeColor: "success" },
              ]}
              value={status}
              onChange={(e) => {
                const next = (e.target as HTMLSelectElement).value;
                setStatus(next);
                void handleUpdateStatus(next);
              }}
              disabled={statusUpdating}
              state={statusError ? "error" : "default"}
              errorMessage={statusError ?? undefined}
            />
          </div>
          <dl className="grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-zinc-500">접수일시</dt>
              <dd>{new Date(inquiry.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">문의자</dt>
              <dd>
                {(() => {
                  const company = inquiry.company ?? "";
                  const title = inquiry.title ?? "";
                  const hasCompanyOrTitle = company || title;
                  const prefix = hasCompanyOrTitle
                    ? [company, title].filter(Boolean).join(" / ")
                    : "";
                  return hasCompanyOrTitle ? `${prefix} - ${inquiry.name}` : inquiry.name;
                })()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">이메일</dt>
              <dd>{inquiry.email}</dd>
            </div>
            {inquiry.referral && (
              <div>
                <dt className="text-xs text-zinc-500">유입경로</dt>
                <dd>{inquiry.referral}</dd>
              </div>
            )}
          </dl>
        </div>
      </Card>

      {/* 문의 내용 + 1차 답변 (2열 구성) */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 문의 내용 */}
        <Card padding="lg">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">문의 내용</h2>
            {inquiry.subject && (
              <h3 className="text-base font-semibold text-zinc-900">
                {inquiry.subject}
              </h3>
            )}
            <div className="whitespace-pre-wrap text-sm text-zinc-800">
              {inquiry.message}
            </div>
          </div>
        </Card>

        {/* 1차 답변 */}
        <Card padding="lg">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-zinc-900">1차 답변</h2>
              <Tooltip
                content={
                  <span className="text-xs">
                    아래 입력한 내용은 사용자의 이메일({inquiry.email})로 발송되는 1차 답변으로 기록됩니다.
                  </span>
                }
              >
                <button
                  type="button"
                  aria-label="1차 답변 안내"
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-xs text-zinc-500 hover:bg-zinc-50"
                >
                  ?
                </button>
              </Tooltip>
            </div>

            {inquiry.firstReplyMessage ? (
              <div className="flex flex-col gap-2">
                <div className="whitespace-pre-wrap text-sm text-zinc-800">
                  {inquiry.firstReplyMessage}
                </div>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                {sendError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {sendError}
                  </div>
                )}
                {sendSuccess && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                    {sendSuccess}
                  </div>
                )}
                <TextArea
                  label="답변 내용"
                  placeholder="사용자에게 보낼 1차 답변 내용을 입력하세요."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button type="button" onClick={handleSendReply} loading={sending} disabled={sending || !reply.trim()}>
                    전송하기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
