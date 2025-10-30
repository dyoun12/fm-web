import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

vi.mock("next/link", () => {
  const LinkMock = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
  >(({ href, children, ...props }, ref) => (
    <a ref={ref} href={href} {...props}>
      {children}
    </a>
  ));
  LinkMock.displayName = "NextLinkMock";
  return { default: LinkMock };
});

vi.mock("next/image", () => {
  return {
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const { alt = "", ...rest } = props;
      // eslint-disable-next-line @next/next/no-img-element
      return <img alt={alt} {...rest} />;
    },
  };
});
