export interface OonaMeeting {
  id: string;
  name: string;
  agenda: string;
  start_time: Date;
  stop_time: Date;
  priority: number;
  host_name: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  attendees_name: [
    {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
    }
  ];
}
