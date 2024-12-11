import { FunctionListProps } from '../../types/function.type';

export const FunctionList = ({
  functions,
  toggleCircle,
  filledCircles,
}: FunctionListProps) => {
  return (
    <ul className="list-group list-group-flush ms-4">
      {functions.map((func) => (
        <li
          key={func._id}
          className="list-group-item d-flex align-items-center"
          onClick={() => toggleCircle(func._id)} // Funktion klicken
          style={{ cursor: 'pointer' }}
        >
          <div
            className={`circle-icon me-2 ${filledCircles.has(func._id) ? 'bg-primary' : 'border'}`}
          ></div>
          <span>{func.functionName}</span>
        </li>
      ))}
    </ul>
  );
};
