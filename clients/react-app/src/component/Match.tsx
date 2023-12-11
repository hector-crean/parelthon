import React, { ReactNode } from "react";

interface MatchProps {
  predicate: boolean;
  children: ReactNode;
}

const Match: React.FC<MatchProps> = ({ predicate, children }) => {
  return predicate ? <>{children}</> : null;
};

export { Match };
