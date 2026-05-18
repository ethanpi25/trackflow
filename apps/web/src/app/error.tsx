"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 生产环境可在此上报错误到监控系统
    console.error("[TrackFlow Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
        style={{ background: "var(--error-light)" }}
      >
        😕
      </div>
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          页面加载出了点问题
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          {error.message || "未知错误，请刷新页面重试"}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg px-5 py-2 text-sm font-medium text-text-inverse"
          style={{ background: "var(--gradient-primary-btn)" }}
        >
          重试
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border-default px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
