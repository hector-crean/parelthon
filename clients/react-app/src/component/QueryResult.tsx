// QueryResult.tsx

import { UseQueryResult } from "@tanstack/react-query";
import { ReactNode } from "react";

type RenderChildFn<TData> = (args: { data: TData }) => ReactNode;

type Props<TData> = {
  queryResult: UseQueryResult<TData, unknown>;
  renderLoading?: () => ReactNode;
  renderError?: (error: unknown) => ReactNode;
  children: RenderChildFn<TData>;
};

function QueryResult<TData>({
  children,
  queryResult,
  renderLoading = () => null,
  renderError = () => null,
}: Props<TData>): ReactNode {
  if (queryResult.isLoading) {
    return renderLoading();
  }

  if (queryResult.isError) {
    return renderError(queryResult.error);
  }

  if (queryResult.isSuccess && queryResult.data) {
    return (
      <>
        {children({
          data: queryResult.data,
        })}
      </>
    );
  }

  return null;
}

export { QueryResult };
