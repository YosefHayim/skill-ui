import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** `skill-ui new <name>` — scaffold a template folder (component + test + README) per the recipe. */
export const newCommand = (name: string): void => {
  const pascal = toPascal(name);
  const dir = join("src", "templates", pascal);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${pascal}.tsx`), componentStub(pascal));
  writeFileSync(join(dir, `${pascal}.test.tsx`), testStub(pascal));
  writeFileSync(
    join(dir, "README.md"),
    `# ${pascal}\n\nWhat it renders + an example \`data.json\`.\n`,
  );
  process.stdout.write(
    `skill-ui: scaffolded src/templates/${pascal}/ — register it in src/templates/index.ts\n`,
  );
};

function toPascal(name: string): string {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function componentStub(name: string): string {
  return `import { SectionCard } from "../../components/SectionCard";

export interface ${name}Props {
  readonly title: string;
}

export const ${name} = ({ title }: ${name}Props) => {
  if (!title) throw new Error("${name}: title is required");
  return (
    <SectionCard title={title} chip="new">
      {/* compose components here */}
    </SectionCard>
  );
};
`;
}

function testStub(name: string): string {
  return `import { describe, expect, it } from "vitest";
import { render } from "../../render/render";
import { ${name} } from "./${name}";

describe("${name}", () => {
  it("renders the title", () => {
    expect(render(<${name} title="Hi" />)).toContain("Hi");
  });
});
`;
}
