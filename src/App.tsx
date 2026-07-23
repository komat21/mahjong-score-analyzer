import { useEffect, useState } from "react";
import "./App.css";

type GameType = "三麻" | "四麻";
type Rank = 1 | 2 | 3 | 4;

type MahjongRecord = {
  id: number;
  date: string;
  gameType: GameType;
  rank: Rank;
  score: number;
  memo: string;
};

function App() {
  const [records, setRecords] = useState<MahjongRecord[]>(() => {
    const savedRecords = localStorage.getItem("mahjongRecords");

    if (savedRecords) {
      return JSON.parse(savedRecords);
    }

    return [];
  });

  const [date, setDate] = useState("");
  const [gameType, setGameType] = useState<GameType>("三麻");
  const [rank, setRank] = useState<Rank>(1);
  const [score, setScore] = useState("");
  const [memo, setMemo] = useState("");
  const [filter, setFilter] = useState<"すべて" | GameType>("すべて");

  useEffect(() => {
    localStorage.setItem("mahjongRecords", JSON.stringify(records));
  }, [records]);

  function addRecord() {
    if (date === "" || score === "") {
      alert("日付と得点を入力してください");
      return;
    }

    if (gameType === "三麻" && rank === 4) {
      alert("三麻では4位を選択できません");
      return;
    }

    const newRecord: MahjongRecord = {
      id: Date.now(),
      date: date,
      gameType: gameType,
      rank: rank,
      score: Number(score),
      memo: memo,
    };

    setRecords([...records, newRecord]);

    setDate("");
    setGameType("三麻");
    setRank(1);
    setScore("");
    setMemo("");
  }

  function deleteRecord(id: number) {
    const result = window.confirm("この対局記録を削除しますか？");

    if (result) {
      const newRecords = records.filter((record) => record.id !== id);
      setRecords(newRecords);
    }
  }

  const filteredRecords = records.filter((record) => {
    if (filter === "すべて") {
      return true;
    }

    return record.gameType === filter;
  });

  function calculateAverageRank(): string {
    if (filteredRecords.length === 0) {
      return "0.00";
    }

    const totalRank = filteredRecords.reduce((total, record) => {
      return total + record.rank;
    }, 0);

    return (totalRank / filteredRecords.length).toFixed(2);
  }

  function calculateRankRate(targetRank: Rank): string {
    if (filteredRecords.length === 0) {
      return "0.0";
    }

    const count = filteredRecords.filter(
      (record) => record.rank === targetRank
    ).length;

    return ((count / filteredRecords.length) * 100).toFixed(1);
  }

  function calculateAverageScore(): string {
    if (filteredRecords.length === 0) {
      return "0";
    }

    const totalScore = filteredRecords.reduce((total, record) => {
      return total + record.score;
    }, 0);

    return Math.round(totalScore / filteredRecords.length).toLocaleString();
  }

  return (
    <div className="container">
      <header>
        <h1>麻雀成績分析ツール</h1>
        <p>対局結果を記録して、自分の成績を分析できます。</p>
      </header>

      <section className="input-section">
        <h2>対局結果を入力</h2>

        <div className="form-grid">
          <div className="form-item">
            <label>対局日</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="form-item">
            <label>ルール</label>
            <select
              value={gameType}
              onChange={(event) => {
                const selectedGameType = event.target.value as GameType;
                setGameType(selectedGameType);

                if (selectedGameType === "三麻" && rank === 4) {
                  setRank(1);
                }
              }}
            >
              <option value="三麻">三麻</option>
              <option value="四麻">四麻</option>
            </select>
          </div>

          <div className="form-item">
            <label>順位</label>
            <select
              value={rank}
              onChange={(event) =>
                setRank(Number(event.target.value) as Rank)
              }
            >
              <option value={1}>1位</option>
              <option value={2}>2位</option>
              <option value={3}>3位</option>

              {gameType === "四麻" && <option value={4}>4位</option>}
            </select>
          </div>

          <div className="form-item">
            <label>得点</label>
            <input
              type="number"
              value={score}
              placeholder="例：41200"
              onChange={(event) => setScore(event.target.value)}
            />
          </div>

          <div className="form-item memo-item">
            <label>メモ</label>
            <input
              type="text"
              value={memo}
              placeholder="例：親のツモで逆転された"
              onChange={(event) => setMemo(event.target.value)}
            />
          </div>
        </div>

        <button className="add-button" onClick={addRecord}>
          記録を追加
        </button>
      </section>

      <section className="filter-section">
        <h2>表示するルール</h2>

        <div className="filter-buttons">
          <button
            className={filter === "すべて" ? "active" : ""}
            onClick={() => setFilter("すべて")}
          >
            すべて
          </button>

          <button
            className={filter === "三麻" ? "active" : ""}
            onClick={() => setFilter("三麻")}
          >
            三麻
          </button>

          <button
            className={filter === "四麻" ? "active" : ""}
            onClick={() => setFilter("四麻")}
          >
            四麻
          </button>
        </div>
      </section>

      <section className="statistics-section">
        <h2>成績</h2>

        <div className="statistics-grid">
          <div className="stat-card">
            <p>対局数</p>
            <strong>{filteredRecords.length}回</strong>
          </div>

          <div className="stat-card">
            <p>平均順位</p>
            <strong>{calculateAverageRank()}位</strong>
          </div>

          <div className="stat-card">
            <p>平均得点</p>
            <strong>{calculateAverageScore()}点</strong>
          </div>

          <div className="stat-card">
            <p>1位率</p>
            <strong>{calculateRankRate(1)}%</strong>
          </div>

          <div className="stat-card">
            <p>2位率</p>
            <strong>{calculateRankRate(2)}%</strong>
          </div>

          <div className="stat-card">
            <p>3位率</p>
            <strong>{calculateRankRate(3)}%</strong>
          </div>

          <div className="stat-card">
            <p>4位率</p>
            <strong>{calculateRankRate(4)}%</strong>
          </div>
        </div>
      </section>

      <section className="history-section">
        <h2>対局履歴</h2>

        {filteredRecords.length === 0 ? (
          <p className="empty-message">まだ対局記録がありません。</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>日付</th>
                  <th>ルール</th>
                  <th>順位</th>
                  <th>得点</th>
                  <th>メモ</th>
                  <th>操作</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.gameType}</td>
                    <td>{record.rank}位</td>
                    <td>{record.score.toLocaleString()}点</td>
                    <td>{record.memo || "なし"}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteRecord(record.id)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;