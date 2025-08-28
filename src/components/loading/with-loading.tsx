"use client";

import { Suspense, ComponentType } from "react";
import { ComponentLoading } from "./component-loading";

// ----------------------------------------------------------------------

interface WithLoadingOptions {
  variant?: "widget" | "chart" | "table" | "card";
  height?: number | string;
  delay?: number;
}

export function withLoading<P extends object>(
  Component: ComponentType<P>,
  options: WithLoadingOptions = {}
) {
  const { variant = "card", height = 200, delay = 0 } = options;

  const LoadingFallback = () => (
    <ComponentLoading variant={variant} height={height} />
  );

  const WrappedComponent = (props: P) => {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };

  WrappedComponent.displayName = `withLoading(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Specific HOCs for different component types
export function withWidgetLoading<P extends object>(Component: ComponentType<P>) {
  return withLoading(Component, { variant: "widget", height: 120 });
}

export function withChartLoading<P extends object>(Component: ComponentType<P>) {
  return withLoading(Component, { variant: "chart", height: 300 });
}

export function withTableLoading<P extends object>(Component: ComponentType<P>) {
  return withLoading(Component, { variant: "table", height: 400 });
}

export function withCardLoading<P extends object>(
  Component: ComponentType<P>,
  height: number | string = 200
) {
  return withLoading(Component, { variant: "card", height });
}
