
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MessageCircle, User } from 'lucide-react';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  isVirtual: boolean;
}

const AppointmentList = () => {
  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Jane Smith',
      specialty: 'Cardiology',
      date: '2025-04-20',
      time: '10:00 AM',
      isVirtual: true,
    },
    {
      id: '2',
      doctorName: 'Dr. James Wilson',
      specialty: 'Neurology',
      date: '2025-04-25',
      time: '2:30 PM',
      isVirtual: false,
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Upcoming Appointments</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex justify-between items-center p-4 border rounded-lg card-hover">
                <div className="flex gap-4 items-center">
                  <div className={`p-2 rounded-full ${appointment.isVirtual ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {appointment.isVirtual ? (
                      <MessageCircle className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{appointment.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(appointment.date).toLocaleDateString()}
                      <Clock className="h-3 w-3 mx-1 ml-2" />
                      {appointment.time}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Reschedule</Button>
                  <Button size="sm">Join {appointment.isVirtual ? 'Call' : 'Queue'}</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming appointments</p>
            <Button variant="outline" className="mt-2">Schedule an Appointment</Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View All Appointments</Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentList;
