export function transformRender(
  svelteRenderer: (props: any) => {
    html: string;
    head: string | null;
    css: { code: string | null };
  }
) {
  return (props: any) => {
    const {
      css: { code },
      head,
      html,
    } = svelteRenderer(props);

    return {
      html,
      head: head || "",
      css: code || "",
    };
  };
}
