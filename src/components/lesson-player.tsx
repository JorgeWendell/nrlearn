"use client";

import { useEffect, useRef, useState } from "react";
import { markLessonComplete } from "@/lib/actions/progress";
import { parseVimeoId, parseYoutubeId } from "@/lib/format";

declare global {
  interface Window {
    YT?: {
      Player: new (
        id: string,
        opts: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, number>;
          events?: { onStateChange?: (e: { data: number }) => void };
        },
      ) => unknown;
      PlayerState?: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function LessonPlayer({
  lessonId,
  videoUrl,
  completed,
  materialName,
}: {
  lessonId: string;
  videoUrl: string;
  completed: boolean;
  materialName?: string | null;
  materialMime?: string | null;
}) {
  const [done, setDone] = useState(completed);
  const saving = useRef(false);
  const youtubeId = parseYoutubeId(videoUrl);
  const vimeoId = parseVimeoId(videoUrl);
  const hasVideo = Boolean(videoUrl);
  const hasMaterial = Boolean(materialName);
  const materialHref = `/api/lessons/${lessonId}/material`;
  const playerId = `yt-${lessonId}`;

  async function complete() {
    if (saving.current || done) return;
    saving.current = true;
    const res = await markLessonComplete(lessonId);
    if (res.ok) setDone(true);
    saving.current = false;
  }

  useEffect(() => {
    if (!youtubeId) return;

    const setup = () => {
      if (!window.YT?.Player) return;
      new window.YT.Player(playerId, {
        videoId: youtubeId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e) => {
            if (e.data === 0) void complete();
          },
        },
      });
    };

    if (window.YT?.Player) {
      setup();
      return;
    }

    const existing = document.querySelector("script[src='https://www.youtube.com/iframe_api']");
    window.onYouTubeIframeAPIReady = setup;
    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, [youtubeId, playerId]);

  useEffect(() => {
    if (!vimeoId) return;
    const origin = "https://player.vimeo.com";
    function onMessage(event: MessageEvent) {
      if (event.origin !== origin) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "finish" || data?.method === "finish") void complete();
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [vimeoId]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {hasVideo ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black [&_iframe]:h-full [&_iframe]:w-full">
          {youtubeId ? (
            <div id={playerId} className="h-full w-full" />
          ) : vimeoId ? (
            <iframe
              className="h-full w-full"
              src={`https://player.vimeo.com/video/${vimeoId}?api=1`}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <video className="h-full w-full" src={videoUrl} controls onEnded={() => void complete()} />
          )}
        </div>
      ) : null}

      {hasMaterial ? (
        <iframe
          title="Material da aula"
          src={`${materialHref}#toolbar=0&navpanes=0`}
          className="h-[70vh] w-full rounded-xl border-0 bg-white"
        />
      ) : null}

      {done ? (
        <p className="inline-flex rounded-full bg-emerald-700 px-3 py-1 text-sm font-semibold text-white">
          Concluído
        </p>
      ) : hasVideo ? (
        <p className="text-sm text-muted">Assista até o fim para marcar como concluído.</p>
      ) : (
        <button
          type="button"
          onClick={() => void complete()}
          className="self-start rounded-lg bg-[#a855f7] px-4 py-2 text-sm font-semibold hover:bg-[#c084fc]"
        >
          Marcar como concluído
        </button>
      )}
    </div>
  );
}
