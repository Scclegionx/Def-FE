import React, { useState, useEffect } from 'react';
import radarHistoryService from '../../services/radarHistoryService';
import '../../styles/RadarHis.css';

const RadarHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Lấy tổng số bản ghi
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const total = await radarHistoryService.getTotalDiscoveryHistory();
        setTotalItems(total);
        setTotalPages(Math.ceil(total / size));
      } catch (error) {
        console.error('Lỗi khi lấy tổng số bản ghi:', error);
      }
    };
    fetchTotal();
  }, []);

  // Lấy dữ liệu theo trang
  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await radarHistoryService.getDiscoveryHistory(page, size);
      setHistory(response.data);
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

  // Hàm format khoảng cách
  const formatDistance = (distance) => {
    if (!distance) return 'Chưa xác định';
    return `${Number(distance).toFixed(1)}cm`;
  };

  // Hàm format thời gian
  const formatTime = (timeStr) => {
    if (!timeStr) return 'Chưa xác định';
    try {
      const date = new Date(timeStr);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Lỗi khi format thời gian:', error);
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
          <div className="statistics-summary">
            <p>Tổng số bản ghi: {totalItems}</p>
          </div>

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
                  <td>{formatTime(record.time)}</td>
                  <td>{formatDistance(record.distance)}</td>
                  <td>
                    <span className={`method-badge ${record.method?.toLowerCase()}`}>
                      {getMethodText(record.method)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
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