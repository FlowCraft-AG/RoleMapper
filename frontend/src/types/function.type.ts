export type Function = {
  _id: string;
  functionName: string;
  users: string[];
  orgUnit: string;
  isSingleUser: boolean;
};

export type FunctionInfo = {
  _id: string;
  functionName: string;
  users: string[];
};

export type FunctionListProps = {
  functions: Function[];
  toggleCircle: (mandate: Function) => void;
  filledCircles: Set<string>;
};
