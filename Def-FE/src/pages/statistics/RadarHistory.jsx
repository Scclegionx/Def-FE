import React, { useState, useEffect } from 'react';
import radarHistoryService from '../../services/radarHistoryService';

const RadarHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await radarHistoryService.getDiscoveryHistory(page, size);
      setHistory(response.data);
      setTotalPages(Math.ceil(response.total / size));
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMethodText = (method) => {
    if (!method) return 'Chưa xác định';
    switch(method.toLowerCase()) {
      case 'radar':
        return 'Radar';
      case 'camera':
        return 'Camera';
      default:
        return 'Chưa xác định';
    }
  };

  return (
    <div className="statistics-container">
      <h1 className="statistics-title">Lịch Sử Phát Hiện</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <>
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Khoảng cách</th>
                <th>Phương thức phát hiện</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id}>
                  <td>{record.time || 'Chưa xác định'}</td>
                  <td>{record.distance ? `${record.distance}m` : 'Chưa xác định'}</td>
                  <td>
                    <span className={`method-badge ${record.method?.toLowerCase()}`}>
                      {getMethodText(record.method)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang - chỉ hiển thị khi có nhiều hơn 1 trang */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Trang trước
              </button>
              <span>Trang {page} / {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Trang sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RadarHistory; 