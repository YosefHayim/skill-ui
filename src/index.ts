// Public API. Consumers author against these components and turn a tree into HTML with render().

export { CodeBlock, type CodeBlockProps } from "./components/CodeBlock";
export { DiffBlock, type DiffBlockProps } from "./components/DiffBlock";
export { Flow, type FlowProps } from "./components/Flow";
export { PickBlock, type PickBlockProps } from "./components/PickBlock";
export { SectionCard, type SectionCardProps } from "./components/SectionCard";
export { Shell, type ShellProps } from "./components/Shell";
export { SubmitBar, type SubmitBarProps } from "./components/SubmitBar";
export { TreePanel, type TreePanelProps } from "./components/TreePanel";
export type { Decision } from "./contracts/decision";
export { raw } from "./render/raw";
export { render, type RenderOptions } from "./render/render";
export type { Theme } from "./render/theme";
export { serve, type ServeOptions } from "./server/serve";
export { BeforeAfter, type BeforeAfterProps } from "./templates/BeforeAfter/BeforeAfter";
export { CodeStylePlan, type CodeStylePlanProps } from "./templates/CodeStylePlan/CodeStylePlan";
export { SAMPLES, TEMPLATES, type TemplateName } from "./templates";
