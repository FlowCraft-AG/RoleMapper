export type Function = {
  _id: string;
  functionName: string;
  users: string[];
  orgUnit: string;
};

export type FunctionListProps = {
  functions: Function[];
  toggleCircle: (mandate: Function) => void;
  filledCircles: Set<string>;
};
