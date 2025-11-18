"use client"

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { RefObject, ReactNode } from "react"
import type { JSONContent } from "@tiptap/react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- UI Primitives ---
import { Button } from "@/app/components/tiptap-ui-primitive/button"
import { Spacer } from "@/app/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/app/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import "@/app/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/app/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/app/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/app/components/tiptap-node/list-node/list-node.scss"
import "@/app/components/tiptap-node/image-node/image-node.scss"
import "@/app/components/tiptap-node/heading-node/heading-node.scss"
import "@/app/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/app/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/app/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/app/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/app/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/app/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/app/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/app/components/tiptap-ui/link-popover"
import { MarkButton } from "@/app/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/app/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/app/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/app/components/tiptap-icons/arrow-left-icon"
import { DotsHorizontalIcon } from "@/app/components/tiptap-icons/dots-horizontal-icon"
import { HighlighterIcon } from "@/app/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/app/components/tiptap-icons/link-icon"
import { ListIcon } from "@/app/components/tiptap-icons/list-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Styles ---
import "@/app/components/tiptap-templates/simple/simple-editor.scss"

import defaultContent from "@/app/components/tiptap-templates/simple/data/content.json"
import { Card } from "@/app/components/atoms/card/card"
import { COMMON_EXTENSIONS } from "@/lib/tiptap"

const FALLBACK_CONTENT: JSONContent = defaultContent as JSONContent

type SimpleEditorProps = {
  content?: JSONContent | null
  onChange?: (value: JSONContent) => void
  sidebarOpen?: boolean
  sidebarOpenHandle?: () => void
}

type ToolbarSegment = {
  id: string
  priority: number
  render: () => ReactNode
}

const useToolbarOverflow = ({
  toolbarRef,
  containerRef,
  segments,
}: {
  toolbarRef: RefObject<HTMLDivElement | null>
  containerRef: RefObject<HTMLDivElement | null>
  segments: ToolbarSegment[]
}) => {
  const overflowPanelId = useId()
  const [hiddenSegmentIds, setHiddenSegmentIds] = useState<string[]>([])
  const [isOverflowPanelRawOpen, setOverflowPanelRawOpen] = useState(false)
  const hiddenSegmentIdsRef = useRef<string[]>([])
  const containerWidthRef = useRef(0)

  const updateHiddenSegmentIds = useCallback(
    (updater: (prev: string[]) => string[]) => {
      setHiddenSegmentIds((prev) => {
        const next = updater(prev)
        hiddenSegmentIdsRef.current = next
        return next
      })
    },
    []
  )

  useEffect(() => {
    updateHiddenSegmentIds((prev) => {
      const filtered = prev.filter((id) =>
        segments.some((segment) => segment.id === id)
      )
      return filtered.length === prev.length ? prev : filtered
    })
  }, [segments, updateHiddenSegmentIds])

  const adjustSegments = useCallback(() => {
    const toolbar = toolbarRef.current
    const container = containerRef.current
    if (!toolbar || !container) return

    const containerWidth = container.clientWidth
    if (containerWidth === 0) return

    const currentHidden = hiddenSegmentIdsRef.current
    const visibleCandidates = segments.filter(
      (segment) => !currentHidden.includes(segment.id)
    )
    const hiddenCandidates = segments.filter((segment) =>
      currentHidden.includes(segment.id)
    )

    const didContainerGrow = containerWidth > containerWidthRef.current
    containerWidthRef.current = containerWidth

    if (toolbar.scrollWidth > containerWidth && visibleCandidates.length > 0) {
      const toHide = visibleCandidates.reduce<ToolbarSegment | null>(
        (candidate, segment) => {
          if (!candidate) return segment
          return segment.priority > candidate.priority ? segment : candidate
        },
        null
      )
      if (toHide) {
        updateHiddenSegmentIds((prev) => [...prev, toHide.id])
      }
      return
    }

    if (
      toolbar.scrollWidth <= containerWidth &&
      hiddenCandidates.length > 0 &&
      didContainerGrow
    ) {
      const toRestore = hiddenCandidates.reduce<ToolbarSegment | null>(
        (candidate, segment) => {
          if (!candidate) return segment
          return segment.priority < candidate.priority ? segment : candidate
        },
        null
      )
      if (toRestore) {
        updateHiddenSegmentIds((prev) =>
          prev.filter((id) => id !== toRestore.id)
        )
      }
    }
  }, [containerRef, segments, toolbarRef])
  useLayoutEffect(() => {
    adjustSegments()
  }, [adjustSegments])

  useEffect(() => {
    const toolbarEl = toolbarRef.current
    const containerEl = containerRef.current
    if (!toolbarEl || !containerEl || typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(() => {
      adjustSegments()
    })

    observer.observe(toolbarEl)
    observer.observe(containerEl)

    return () => {
      observer.disconnect()
    }
  }, [adjustSegments, containerRef, toolbarRef])

  useEffect(() => {
    // no-op: derived open state from hiddenSegmentIds
  }, [hiddenSegmentIds])

  const toggleOverflowPanel = useCallback(() => {
    setOverflowPanelRawOpen((prev) => !prev)
  }, [])

  const closeOverflowPanel = useCallback(() => {
    setOverflowPanelRawOpen(false)
  }, [])

  const isOverflowPanelOpen = hiddenSegmentIds.length > 0 && isOverflowPanelRawOpen

  useEffect(() => {
    if (!isOverflowPanelOpen) return

    const handleOutsideClick = (event: PointerEvent) => {
      if (toolbarRef.current?.contains(event.target as Node)) {
        return
      }
      closeOverflowPanel()
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverflowPanel()
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick)
    window.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick)
      window.removeEventListener("keydown", handleEscape)
    }
  }, [closeOverflowPanel, isOverflowPanelOpen, toolbarRef])

  const visibleSegments = useMemo(
    () => segments.filter((segment) => !hiddenSegmentIds.includes(segment.id)),
    [segments, hiddenSegmentIds]
  )

  const hiddenSegments = useMemo(
    () => segments.filter((segment) => hiddenSegmentIds.includes(segment.id)),
    [segments, hiddenSegmentIds]
  )

  return {
    visibleSegments,
    hiddenSegments,
    isOverflowPanelOpen,
    overflowPanelId,
    toggleOverflowPanel,
  }
}

type MainToolbarContentProps = {
  visibleSegments: ToolbarSegment[]
  hasHiddenSegments: boolean
  isOverflowPanelOpen: boolean
  overflowPanelId: string
  toggleOverflowPanel: () => void
  isMobile: boolean
  sidebarOpen: boolean
  sidebarOpenHandle: () => void
}

const MainToolbarContent = ({
  visibleSegments,
  hasHiddenSegments,
  isOverflowPanelOpen,
  overflowPanelId,
  toggleOverflowPanel,
  isMobile,
  sidebarOpen,
  sidebarOpenHandle,
}: MainToolbarContentProps) => {
  return (
    <>
      <Spacer />

      {visibleSegments.map((segment, index) => (
        <Fragment key={segment.id}>
          {index > 0 && <ToolbarSeparator />}
          <ToolbarGroup>{segment.render()}</ToolbarGroup>
        </Fragment>
      ))}

      {hasHiddenSegments && (
        <>
          {visibleSegments.length > 0 && <ToolbarSeparator />}
          <ToolbarGroup className="tiptap-toolbar-more">
            <Button
              data-style="ghost"
              data-open={isOverflowPanelOpen ? "true" : "false"}
              onClick={toggleOverflowPanel}
              aria-haspopup="menu"
              aria-controls={overflowPanelId}
              aria-expanded={isOverflowPanelOpen}
              aria-label="추가 편집 도구 보기"
            >
              <DotsHorizontalIcon className="tiptap-toolbar-more-icon" />
            </Button>
          </ToolbarGroup>
        </>
      )}

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <Button
          data-style="ghost"
          data-active-state={sidebarOpen ? "on" : "off"}
          data-open={sidebarOpen ? "true" : "false"}
          onClick={sidebarOpenHandle}
          aria-haspopup="menu"
          aria-pressed={sidebarOpen}
          aria-label="게시물 메타 정보 보기"
        >
          <ListIcon className="tiptap-toolbar-more-icon" />
        </Button>
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor({
  content,
  onChange,
  sidebarOpen,
  sidebarOpenHandle
}: SimpleEditorProps = {}) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const initialContent: JSONContent | null =
    content === undefined ? FALLBACK_CONTENT : content

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: COMMON_EXTENSIONS,
    onUpdate({ editor }) {
      onChange?.(editor.getJSON())
    },
    content: initialContent,
  })

  const toolbarRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [overlayHeight, setOverlayHeight] = useState(0)

  const handleHighlighterClick = useCallback(
    () => setMobileView("highlighter"),
    [setMobileView]
  )
  const handleLinkClick = useCallback(
    () => setMobileView("link"),
    [setMobileView]
  )

  const segments = useMemo<ToolbarSegment[]>(
    () => [
      {
        id: "history",
        priority: 1,
        render: () => (
          <>
            <UndoRedoButton action="undo" />
            <UndoRedoButton action="redo" />
          </>
        ),
      },
      {
        id: "blocks",
        priority: 2,
        render: () => (
          <>
            <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
            <ListDropdownMenu
              types={["bulletList", "orderedList", "taskList"]}
              portal={isMobile}
            />
            <BlockquoteButton />
            <CodeBlockButton />
          </>
        ),
      },
      {
        id: "marks",
        priority: 3,
        render: () => (
          <>
            <MarkButton type="bold" />
            <MarkButton type="italic" />
            <MarkButton type="strike" />
            <MarkButton type="code" />
            <MarkButton type="underline" />
            {!isMobile ? (
              <ColorHighlightPopover />
            ) : (
              <ColorHighlightPopoverButton onClick={handleHighlighterClick} />
            )}
            {!isMobile ? (
              <LinkPopover />
            ) : (
              <LinkButton onClick={handleLinkClick} />
            )}
          </>
        ),
      },
      {
        id: "super",
        priority: 4,
        render: () => (
          <>
            <MarkButton type="superscript" />
            <MarkButton type="subscript" />
          </>
        ),
      },
      {
        id: "align",
        priority: 5,
        render: () => (
          <>
            <TextAlignButton align="left" />
            <TextAlignButton align="center" />
            <TextAlignButton align="right" />
            <TextAlignButton align="justify" />
          </>
        ),
      },
      {
        id: "media",
        priority: 6,
        render: () => <ImageUploadButton text="Add" />,
      },
    ],
    [handleHighlighterClick, handleLinkClick, isMobile]
  )

  const {
    visibleSegments,
    hiddenSegments,
    isOverflowPanelOpen,
    overflowPanelId,
    toggleOverflowPanel,
  } = useToolbarOverflow({
    segments,
    toolbarRef,
    containerRef: wrapperRef,
  })

  // DOM 측정은 반드시 useLayoutEffect에서 실행 (렌더 직후 DOM 확정 시점)
  useLayoutEffect(() => {
    if (toolbarRef.current) {
      const height = toolbarRef.current.getBoundingClientRect().height;
      setOverlayHeight(height);
    }
  }, []);

  const rect = useCursorVisibility({
    editor,
    overlayHeight,
  });

  const isMobileDetailView = isMobile && mobileView !== "main"

  return (
    <Card ref={wrapperRef} className="simple-editor-wrapper" padding="none">
      <EditorContext.Provider value={{ editor }}>
        <div className="simple-editor-toolbar">
          <Toolbar
            ref={toolbarRef}
            style={{
              ...(isMobile
                ? {
                    bottom: `calc(100% - ${height - rect.y}px)`,
                  }
                : {}),
            }}
          >
            {isMobileDetailView ? (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            ) : (
              <MainToolbarContent
                  visibleSegments={visibleSegments}
                  hasHiddenSegments={hiddenSegments.length > 0}
                  isOverflowPanelOpen={isOverflowPanelOpen}
                  overflowPanelId={overflowPanelId}
                  toggleOverflowPanel={toggleOverflowPanel}
                  isMobile={isMobile} 
                  sidebarOpen={!!sidebarOpen}
                  sidebarOpenHandle={sidebarOpenHandle ?? (() => null)}                
              />
            )}
          </Toolbar>

          {!isMobileDetailView && hiddenSegments.length > 0 && (
            <div
              id={overflowPanelId}
              className="tiptap-toolbar-overflow-panel"
              role="menu"
              aria-label="숨겨진 편집 도구"
              aria-hidden={isOverflowPanelOpen ? "false" : "true"}
              data-open={isOverflowPanelOpen ? "true" : "false"}
            >
              {hiddenSegments.map((segment) => (
                <div
                  key={`overflow-${segment.id}`}
                  role="group"
                  className="tiptap-toolbar-overflow-row"
                >
                  {segment.render()}
                </div>
              ))}
            </div>
          )}
        </div>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </Card>
  )
}
