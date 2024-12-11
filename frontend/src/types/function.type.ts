export type Function = {
  _id: string;
  functionName: string;
  users: string[];
  orgUnit: string;
};

export type FunctionListProps = {
  functions: Function[];
  toggleCircle: (functionId: string) => void;
  filledCircles: Set<string>;
};
