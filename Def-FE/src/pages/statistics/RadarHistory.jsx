const RadarHistory = () => {
  // Mock data for radar history
  const radarHistory = [
    {
      id: 1,
      date: '2024-03-15 14:30:00',
      action: 'Radar Activated',
      status: 'Active',
      operator: 'Operator A'
    },
    {
      id: 2,
      date: '2024-03-15 14:25:00',
      action: 'Radar Deactivated',
      status: 'Inactive',
      operator: 'Operator A'
    },
    {
      id: 3,
      date: '2024-03-15 14:20:00',
      action: 'Radar Activated',
      status: 'Active',
      operator: 'Operator B'
    },
    {
      id: 4,
      date: '2024-03-15 14:15:00',
      action: 'Radar Deactivated',
      status: 'Inactive',
      operator: 'Operator B'
    },
    {
      id: 5,
      date: '2024-03-15 14:10:00',
      action: 'Radar Activated',
      status: 'Active',
      operator: 'Operator A'
    }
  ];

  return (
    <div className="statistics-container">
      <h1 className="statistics-title">Radar History</h1>
      <div className="timeline">
        {radarHistory.map((event) => (
          <div key={event.id} className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-date">{event.date}</div>
              <div className="timeline-text">
                <strong>{event.action}</strong> by {event.operator}
              </div>
              <div className={`status-badge ${event.status.toLowerCase()}`}>
                {event.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarHistory; 