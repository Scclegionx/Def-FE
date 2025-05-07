import React, { useState, useEffect } from 'react';
import shootHistoryService from '../../services/shootHistoryService';
import '../../styles/ShootHis.css';

const ShootingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [remainingBullets, setRemainingBullets] = useState(null);

  // Lấy tổng số bản ghi
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const total = await shootHistoryService.getTotalShootHistory();
        setTotalItems(total);
        setTotalPages(Math.ceil(total / size));
      } catch (error) {
        console.error('Lỗi khi lấy tổng số bản ghi:', error);
      }
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    fetchHistory();
    fetchRemainingBullets();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await shootHistoryService.getShootHistory(page, size);
      setHistory(response.data);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRemainingBullets = async () => {
    try {
      const data = await shootHistoryService.getRemainingBullets();
      setRemainingBullets(data?.number || 0);
    } catch (error) {
      console.error('Lỗi khi lấy số đạn còn lại:', error);
      setRemainingBullets(0);
    }
  };

  // Tính toán thống kê
  const totalShots = history.length;
  const hits = history.filter(record => record.status === 'Thành công').length;
  const hitRate = totalShots > 0 ? ((hits / totalShots) * 100).toFixed(1) : 0;

  const getResultClass = (status) => {
    if (!status) return '';
    return status === 'Thành công' ? 'hit' : 'miss';
  };

  const getResultText = (status) => {
    if (!status) return 'Chưa xác định';
    return status === 'Thành công' ? 'Thành công' : 'Thất bại';
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
      <h1 className="statistics-title">Lịch Sử Bắn</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Thống kê tổng quan */}
      <div className="statistics-summary">
        <div className="summary-card">
          <h3>Tổng số lần bắn</h3>
          <p>{totalShots}</p>
        </div>
        <div className="summary-card">
          <h3>Tỷ lệ thành công</h3>
          <p>{hitRate}%</p>
        </div>
        <div className="summary-card bullets-card">
          <h3>Đạn còn lại trong kho</h3>
          <p className="bullets-count">{remainingBullets !== null ? remainingBullets : 'Đang tải...'}</p>
        </div>
      </div>

      {/* Bảng lịch sử bắn */}
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
                <th>Người bắn</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id}>
                  <td>{formatTime(record.time)}</td>
                  <td>{record.username || 'Chưa xác định'}</td>
                  <td>
                    <span className={`result-badge ${getResultClass(record.status)}`}>
                      {getResultText(record.status)}
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

export default ShootingHistory; 