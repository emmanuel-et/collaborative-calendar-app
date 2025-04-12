import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Calendar } from "@/models/Calendar";

interface CalendarScrollAreaProps {
  calendars: Calendar[];
  onSelectCalendar?: (calendar: Calendar) => void;
}

export function CalendarScrollArea({ calendars, onSelectCalendar }: CalendarScrollAreaProps) {
  const getRandomThemeColor = (seed: string) => {
    const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "bg-purple-500", // Add transparency
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
    ];
    return colors[hash % colors.length];
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-6 p-4">
        {calendars.length ? calendars.map((calendar) => (
          <figure
            key={calendar.name}
            className="shrink-0 w-32 h-32 rounded-md border cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => onSelectCalendar?.(calendar)}
          >
            <div
              className={`h-2/3 ${getRandomThemeColor(calendar.name)} rounded-t-md transition-all duration-300 bg-opacity-70 hover:bg-opacity-100`}
            />
            <figcaption className="h-1/3 flex items-center pl-2 text-xs text-left text-muted-foreground">
              <span className="font-semibold text-foreground truncate">{calendar.name}</span>
            </figcaption>
          </figure>
        )) : <div className="text-muted-foreground">No calendars available</div>}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
