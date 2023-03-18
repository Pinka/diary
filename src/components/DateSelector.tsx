import { type ChangeEventHandler } from "react";

const DateSelector: React.FC<{
  selectedDate: string;
  onChange: (value: string) => void;
}> = ({ selectedDate, onChange }) => {
  const handleDateChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const date = e.target.value.slice(0, 10);
    onChange(date);
  };

  return (
    <div className="date-selector">
      <label htmlFor="date" className="sr-only">
        Date
      </label>
      <input
        type="date"
        title="Select Date"
        name="date"
        value={selectedDate}
        onChange={handleDateChange}
        max={new Date().toISOString().slice(0, 10)}
      />
    </div>
  );
};

export default DateSelector;
