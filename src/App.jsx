import { useState, useEffect } from "react";

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmMessage, setAlarmMessage] = useState("");
  const [showAlarm, setShowAlarm] = useState(false);
  const [studySchedule, setStudySchedule] = useState([
    { id: 1, subject: "Math", time: "09:00", day: "Monday" },
    { id: 2, subject: "Physics", time: "11:00", day: "Tuesday" },
    { id: 3, subject: "Biology", time: "14:00", day: "Thursday" },
  ]);

  const [dailyRoutine, setDailyRoutine] = useState([
    { id: 1, activity: "Fajr Prayer", time: "05:00" },
    { id: 2, activity: "Breakfast", time: "07:00" },
    { id: 3, activity: "Play / Exercise", time: "17:00" },
    { id: 4, activity: "Isha Prayer", time: "19:30" },
    { id: 5, activity: "Sleep", time: "22:30" },
  ]);

  const [newEvent, setNewEvent] = useState({ subject: "", time: "", day: "" });
  const [newRoutine, setNewRoutine] = useState({ activity: "", time: "" });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for alarms based on schedule
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()];
      const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      // Study Schedule Alarm
      const studyMatch = studySchedule.find(
        (e) => e.time === currentTimeStr && e.day === currentDay
      );
      if (studyMatch) {
        setAlarmMessage(`📚 It's time to study: ${studyMatch.subject}`);
        setShowAlarm(true);
        triggerFlash();
        return;
      }

      // Daily Routine Alarm
      const routineMatch = dailyRoutine.find((e) => e.time === currentTimeStr);
      if (routineMatch) {
        setAlarmMessage(`⏰ Reminder: ${routineMatch.activity}`);
        setShowAlarm(true);
        triggerFlash();
      }
    };

    const interval = setInterval(checkAlarms, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [studySchedule, dailyRoutine]);

  const triggerFlash = () => {
    let flashes = 0;
    const flashInterval = setInterval(() => {
      flashes++;
      if (flashes >= 6) clearInterval(flashInterval);
    }, 500);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleAddStudyEvent = () => {
    if (newEvent.subject && newEvent.time && newEvent.day) {
      const newId = Math.max(...studySchedule.map((e) => e.id), 0) + 1;
      setStudySchedule([...studySchedule, { ...newEvent, id: newId }]);
      setNewEvent({ subject: "", time: "", day: "" });
    }
  };

  const handleAddRoutineEvent = () => {
    if (newRoutine.activity && newRoutine.time) {
      const newId = Math.max(...dailyRoutine.map((e) => e.id), 0) + 1;
      setDailyRoutine([...dailyRoutine, { ...newRoutine, id: newId }]);
      setNewRoutine({ activity: "", time: "" });
    }
  };

  const deleteStudyEvent = (id) => {
    setStudySchedule(studySchedule.filter((e) => e.id !== id));
  };

  const deleteRoutineEvent = (id) => {
    setDailyRoutine(dailyRoutine.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 text-white p-4 md:p-8">
      {/* Alarm Modal */}
      {showAlarm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
          <div className="bg-red-600 p-6 rounded-xl shadow-2xl animate-pulse">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">🔔 Reminder</h2>
            <p className="text-lg md:text-xl">{alarmMessage}</p>
            <button
              onClick={() => setShowAlarm(false)}
              className="mt-4 px-4 py-2 bg-white text-red-600 rounded-full hover:bg-gray-100 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-purple-800 p-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">📚 Student TimeTable</h1>
          <p className="opacity-80">Organize your studies & daily life efficiently</p>
          <div className="mt-4 text-xl font-mono">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {/* Study Schedule Section */}
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 border-b border-white/20 pb-2">📅 Study Schedule</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {daysOfWeek.map((day) => (
              <div key={day} className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all">
                <h3 className="font-bold text-lg mb-2">{day}</h3>
                <ul className="space-y-2">
                  {studySchedule
                    .filter((event) => event.day === day)
                    .map((event) => (
                      <li key={event.id} className="flex justify-between items-center bg-black/30 p-2 rounded">
                        <span>{event.time} - {event.subject}</span>
                        <button
                          onClick={() => deleteStudyEvent(event.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ❌
                        </button>
                      </li>
                    ))}
                  {studySchedule.filter((event) => event.day === day).length === 0 && (
                    <li className="text-sm text-gray-400 italic">No study events scheduled</li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* Add Study Event Form */}
          <div className="bg-white/10 rounded-xl p-4 mt-6">
            <h3 className="font-bold text-lg mb-3">Add Study Event</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Subject"
                value={newEvent.subject}
                onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                className="bg-black/30 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="bg-black/30 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={newEvent.day}
                onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
                className="bg-black/30 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddStudyEvent}
              className="mt-3 w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Add Study Event
            </button>
          </div>

          {/* Daily Routine Section */}
          <h2 className="text-xl md:text-2xl font-semibold mt-10 mb-4 border-b border-white/20 pb-2">🧘 Daily Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {dailyRoutine.map((item) => (
              <div key={item.id} className="bg-white/10 rounded-xl p-4 flex justify-between items-center hover:bg-white/20 transition-all">
                <div>
                  <strong>{item.activity}</strong> <br />
                  <small>{item.time}</small>
                </div>
                <button
                  onClick={() => deleteRoutineEvent(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          {/* Add Daily Activity Form */}
          <div className="bg-white/10 rounded-xl p-4 mt-6">
            <h3 className="font-bold text-lg mb-3">Add Daily Activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Activity Name"
                value={newRoutine.activity}
                onChange={(e) => setNewRoutine({ ...newRoutine, activity: e.target.value })}
                className="bg-black/30 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="time"
                value={newRoutine.time}
                onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })}
                className="bg-black/30 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={handleAddRoutineEvent}
              className="mt-3 w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Add Activity
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/30 p-4 text-center text-sm text-gray-400">
          <p>For Students • Organize Your Life • Local Storage Supported</p>
          <p className="mt-1">© 2025 Student Planner. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}