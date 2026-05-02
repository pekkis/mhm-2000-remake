import { rawCalendar } from "@/data/mhm2000/calendar";
import {
  parseCalendar,
  type CalendarEntry,
  type Seed
} from "@/data/mhm2000/parse-calendar";

export type { CalendarEntry, Seed };

const calendar: CalendarEntry[] = parseCalendar(rawCalendar);

export default calendar;
