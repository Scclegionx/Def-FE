const ShootingHistory = () => {
  // Mock data for shooting history
  const shootingHistory = [
    {
      id: 1,
      date: '2024-03-15 14:30:00',
      target: 'Drone A',
      distance: '150m',
      result: 'Hit',
      ammoUsed: 1,
      targetType: 'Quadcopter',
      speed: '30 km/h',
      altitude: '100m'
    },
    {
      id: 2,
      date: '2024-03-15 14:25:00',
      target: 'Drone B',
      distance: '200m',
      result: 'Miss',
      ammoUsed: 1,
      targetType: 'Fixed Wing',
      speed: '45 km/h',
      altitude: '150m'
    },
    {
      id: 3,
      date: '2024-03-15 14:20:00',
      target: 'Drone C',
      distance: '180m',
      result: 'Hit',
      ammoUsed: 1,
      targetType: 'Quadcopter',
      speed: '25 km/h',
      altitude: '80m'
    },
    {
      id: 4,
      date: '2024-03-15 14:15:00',
      target: 'Drone D',
      distance: '220m',
      result: 'Hit',
      ammoUsed: 1,
      targetType: 'Fixed Wing',
      speed: '50 km/h',
      altitude: '200m'
    },
    {
      id: 5,
      date: '2024-03-15 14:10:00',
      target: 'Drone E',
      distance: '190m',
      result: 'Miss',
      ammoUsed: 1,
      targetType: 'Quadcopter',
      speed: '35 km/h',
      altitude: '120m'
    },
    {
      id: 6,
      date: '2024-03-15 14:05:00',
      target: 'Drone F',
      distance: '170m',
      result: 'Hit',
      ammoUsed: 1,
      targetType: 'Fixed Wing',
      speed: '40 km/h',
      altitude: '180m'
    },
    {
      id: 7,
      date: '2024-03-15 14:00:00',
      target: 'Drone G',
      distance: '210m',
      result: 'Hit',
      ammoUsed: 1,
      targetType: 'Quadcopter',
      speed: '28 km/h',
      altitude: '90m'
    },
    {
      id: 8,
      date: '2024-03-15 13:55:00',
      target: 'Drone H',
      distance: '160m',
      result: 'Miss',
      ammoUsed: 1,
      targetType: 'Fixed Wing',
      speed: '55 km/h',
      altitude: '220m'
    },
    {
      id: 9,
      date: '2024-03-15 13:50:00',
      target: 'Drone I',
      distance: '195m',
      result: 'Hit',
      ammoUsed: 1,
      targetType: 'Quadcopter',
      speed: '32 km/h',
      altitude: '110m'
    },
    {
      id: 10,
      date: '2024-03-15 13:45:00',
      target: 'Drone J',
      distance: '185m',
      result: 'Hit',
      ammoUsed: 1,
      targetType: 'Fixed Wing',
      speed: '48 km/h',
      altitude: '160m'
    }
  ];

  // Calculate statistics
  const totalShots = shootingHistory.length;
  const hits = shootingHistory.filter(record => record.result === 'Hit').length;
  const hitRate = ((hits / totalShots) * 100).toFixed(1);
  const totalAmmoUsed = shootingHistory.reduce((sum, record) => sum + record.ammoUsed, 0);

  return (
    <div className="statistics-container">
      <h1 className="statistics-title">Shooting History</h1>
      
      {/* Statistics Summary */}
      <div className="statistics-summary">
        <div className="summary-card">
          <h3>Total Shots</h3>
          <p>{totalShots}</p>
        </div>
        <div className="summary-card">
          <h3>Hit Rate</h3>
          <p>{hitRate}%</p>
        </div>
        <div className="summary-card">
          <h3>Total Ammo Used</h3>
          <p>{totalAmmoUsed}</p>
        </div>
      </div>

      {/* Shooting History Table */}
      <table className="statistics-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Target</th>
            <th>Type</th>
            <th>Distance</th>
            <th>Speed</th>
            <th>Altitude</th>
            <th>Result</th>
            <th>Ammo Used</th>
          </tr>
        </thead>
        <tbody>
          {shootingHistory.map((record) => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{record.target}</td>
              <td>{record.targetType}</td>
              <td>{record.distance}</td>
              <td>{record.speed}</td>
              <td>{record.altitude}</td>
              <td>
                <span className={`result-badge ${record.result.toLowerCase()}`}>
                  {record.result}
                </span>
              </td>
              <td>{record.ammoUsed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShootingHistory; 