const AmmoStatus = () => {
  // Mock data for ammo status
  const ammoTypes = [
    {
      id: 1,
      type: 'Standard Rounds',
      total: 1000,
      remaining: 750,
      percentage: 75
    },
    {
      id: 2,
      type: 'Armor Piercing',
      total: 500,
      remaining: 300,
      percentage: 60
    },
    {
      id: 3,
      type: 'High Explosive',
      total: 200,
      remaining: 150,
      percentage: 75
    },
    {
      id: 4,
      type: 'Tracer Rounds',
      total: 300,
      remaining: 200,
      percentage: 67
    }
  ];

  return (
    <div className="statistics-container">
      <h1 className="statistics-title">Ammo Status</h1>
      <div className="ammo-status-container">
        {ammoTypes.map((ammo) => (
          <div key={ammo.id} className="ammo-card">
            <h2 className="ammo-card-title">{ammo.type}</h2>
            <div className="ammo-count">{ammo.remaining}</div>
            <div className="ammo-total">of {ammo.total} rounds</div>
            <div className="ammo-progress">
              <div 
                className="progress-bar"
                style={{ width: `${ammo.percentage}%` }}
              />
            </div>
            <div className="ammo-percentage">{ammo.percentage}% remaining</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmmoStatus; 