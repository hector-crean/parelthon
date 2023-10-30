// QueryResult.tsx

import { UseMutationResult } from "@tanstack/react-query";
import { ReactNode } from "react";

type RenderChildFn<TData> = (args: { data: TData }) => ReactNode;

type Props<TData, TError = Error, TVariables = unknown, TContext = unknown> = {
  mutationResult: UseMutationResult<TData, TError, TVariables, TContext>;
  renderInitial: () => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (error: unknown) => ReactNode;
  children: RenderChildFn<TData>;
};

function MutationResult<
  TData,
  TError = Error,
  TVariables = unknown,
  TContext = unknown
>({
  children,
  mutationResult,
  renderInitial,
  renderLoading = () => null,
  renderError = () => null,
}: Props<TData, TError, TVariables, TContext>): ReactNode {
  if (mutationResult.isPending) {
    return renderLoading();
  }

  if (mutationResult.isError) {
    return renderError(mutationResult.error);
  }

  if (mutationResult.isSuccess && mutationResult.data) {
    return (
      <>
        {children({
          data: mutationResult.data,
        })}
      </>
    );
  }

  return renderInitial();
}

export { MutationResult };
